// backend/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect with MONGO_URI:', process.env.MONGO_URI); 

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
            autoCreate: true,  // 컬렉션 및 인덱스 자동 생성
            autoIndex: true,   // 인덱스 자동 생성 활성화
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // ✅ User 모델의 인덱스 생성 과정을 명시적으로 로그
        // (서버 시작 후 Mongoose가 인덱스 생성 완료될 때까지 약간의 시간이 걸릴 수 있습니다)
        conn.connection.on('connected', function () {
            mongoose.connection.db.collection('users').indexInformation(function (err, data) {
                if (err) {
                    console.error('Error fetching index information:', err);
                } else {
                    console.log('MongoDB Users Collection Index Information:', data);
                }
            });
        });

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`); 
        process.exit(1); 
    }
};

module.exports = connectDB;