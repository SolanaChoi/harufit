const request = require('supertest');
const app = require('../src/app'); // Express 앱 인스턴스를 가져옵니다.
const mongoose = require('mongoose');
const User = require('../src/models/User'); // User 모델 불러오기

// 테스트 시작 전에 MongoDB 연결
beforeAll(async () => {
  // 테스트용 DB URI 사용 (dotenv를 통해 MONGO_URI_TEST가 설정되어야 함)
  // Mongoose 6.0 이상에서는 useNewUrlParser와 useUnifiedTopology 옵션이 기본값이므로 명시할 필요가 없습니다.
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/harufit_test_db');
  console.log('Test MongoDB Connected');
});

// 각 테스트 실행 후 데이터 정리
afterEach(async () => {
  // 각 테스트 후 사용자 데이터를 깔끔하게 지웁니다.
  await User.deleteMany({});
});

// 모든 테스트 완료 후 MongoDB 연결 해제
afterAll(async () => {
  await mongoose.connection.close();
  console.log('Test MongoDB Disconnected');
});

describe('User API', () => {
  // 새로운 사용자 생성 테스트
  it('should create a new user with nickname and PIN', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        nickname: 'testuser',
        mode: 'easy',
        pin: '1234'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('사용자가 성공적으로 생성되었습니다.');
    expect(res.body.user.nickname).toEqual('testuser');
    expect(res.body.user.id).toBeDefined(); // id 필드가 정의되었는지 확인
    // 보안상 응답에 pin이 없어야 함을 확인 (선택 사항)
    expect(res.body.user.pin).toBeUndefined(); 
  });

  // 기존 닉네임으로 사용자 생성 시도 (실패 케이스)
  it('should not create a user with an existing nickname', async () => {
    // 먼저 사용자 생성
    await request(app)
      .post('/api/users')
      .send({
        nickname: 'duplicateuser',
        mode: 'easy',
        pin: '1111'
      });

    // 동일한 닉네임으로 다시 생성 시도
    const res = await request(app)
      .post('/api/users')
      .send({
        nickname: 'duplicateuser',
        mode: 'normal',
        pin: '2222'
      });
    expect(res.statusCode).toEqual(409); // 충돌 오류
    expect(res.body.message).toEqual('이미 존재하는 닉네임입니다. 다른 닉네임을 선택해주세요.');
  });

  // 닉네임으로 사용자 조회 테스트
  it('should get a user by nickname and PIN', async () => {
    // 먼저 사용자 생성
    const createUserRes = await request(app)
      .post('/api/users')
      .send({
        nickname: 'finduser',
        mode: 'hard',
        pin: '5678' // 테스트에 사용할 PIN 번호
      });

    // 사용자 생성이 성공했는지 기본적으로 확인
    expect(createUserRes.statusCode).toEqual(201);
    expect(createUserRes.body.message).toEqual('사용자가 성공적으로 생성되었습니다.');
    expect(createUserRes.body.user.nickname).toEqual('finduser');
    // NOTE: createUserRes.body.user.pin 은 보안상 응답에 포함되지 않으므로,
    // 여기서 직접 '5678'이라는 값을 사용하거나 테스트 사용자 생성 시점에 값을 저장해야 합니다.

    // ✅ 추가 로그: createUserRes.body 객체 전체를 출력하여 id 필드 존재 여부 확인
    console.log(`[Test] createUserRes.body (from POST):`, createUserRes.body);

    // 생성된 사용자 조회
    const targetNickname = createUserRes.body.user.nickname;
    const targetPin = '5678'; // 명시적으로 PIN 사용
    
    // ✅ 로그 추가: 어떤 URL로 요청이 나가는지 확인
    console.log(`[Test] Attempting GET: /api/users/${targetNickname}?pin=${targetPin}`); 

    const res = await request(app)
      .get(`/api/users/${targetNickname}?pin=${targetPin}`)
      .send(); // GET 요청에 send()는 보통 빈 값으로 보냅니다.
      
    // ✅ 로그 추가: 응답 상태 코드와 바디 확인
    console.log(`[Test] GET Response Status: ${res.statusCode}`);
    console.log(`[Test] GET Response Body:`, res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('사용자 정보를 성공적으로 가져왔습니다.');
    expect(res.body.user.nickname).toEqual('finduser');
    
    // MongoDB ID는 문자열로 비교해야 합니다.
    // ✅ 핵심 수정: createUserRes.body.user.id가 undefined일 경우 _id를 사용하도록 대체
    const expectedId = createUserRes.body.user.id || createUserRes.body.user._id; 
    expect(String(res.body.user.id)).toEqual(String(expectedId));
  });

  // 잘못된 PIN으로 사용자 조회 시도 (실패 케이스)
  it('should not get a user with incorrect PIN', async () => {
    // 먼저 사용자 생성
    await request(app)
      .post('/api/users')
      .send({
        nickname: 'secureuser',
        mode: 'easy',
        pin: '9876'
      });

    // 잘못된 PIN으로 조회 시도
    const res = await request(app)
      .get('/api/users/secureuser?pin=0000')
      .send();
    expect(res.statusCode).toEqual(404); // 찾을 수 없거나 PIN 불일치
    expect(res.body.message).toEqual('사용자를 찾을 수 없거나 PIN이 일치하지 않습니다.');
  });

  // 4자리가 아닌 PIN으로 사용자 생성 시도 (실패 케이스)
  it('should not create a user with a PIN not exactly 4 digits', async () => {
    const resShort = await request(app)
      .post('/api/users')
      .send({
        nickname: 'shortpinuser',
        mode: 'easy',
        pin: '123'
      });
    expect(resShort.statusCode).toEqual(400);
    expect(resShort.body.message).toEqual('PIN 번호는 정확히 4자리여야 합니다.');

    const resLong = await request(app)
      .post('/api/users')
      .send({
        nickname: 'longpinuser',
        mode: 'easy',
        pin: '12345'
      });
    expect(resLong.statusCode).toEqual(400);
    expect(resLong.body.message).toEqual('PIN 번호는 정확히 4자리여야 합니다.');
  });

  // PIN이 숫자로만 구성되지 않은 경우 (실패 케이스)
  it('should not create a user with a non-numeric PIN', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        nickname: 'alphapinuser',
        mode: 'easy',
        pin: 'abcd'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('PIN 번호는 숫자로만 구성되어야 합니다.');
  });
});