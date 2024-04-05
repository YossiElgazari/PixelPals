"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
// Mock a protected route
app_1.default.get('/protected-route', authMiddleware_1.protect, (req, res) => {
    res.json({ message: 'You are authorized' });
});
describe('GET /protected-route', () => {
    it('should deny access without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/protected-route');
        expect(res.statusCode).toEqual(401);
    }));
    it('should allow access with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        // You'll need a way to generate or mock a valid token
        const validToken = '...'; // This should be replaced with a valid token
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/protected-route')
            .set('Authorization', `Bearer ${validToken}`);
        expect(res.statusCode).toEqual(200);
    }));
    it('should deny access with expired token', () => __awaiter(void 0, void 0, void 0, function* () {
        // You'll need a way to generate or mock an expired token
        const expiredToken = '...'; // This should be replaced with an expired token
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/protected-route')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.statusCode).toEqual(401);
    }));
    it('should deny access with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        // You'll need a way to generate or mock an invalid token
        const invalidToken = '...'; // This should be replaced with an invalid token
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/protected-route')
            .set('Authorization', `Bearer ${invalidToken}`);
        expect(res.statusCode).toEqual(401);
    }));
});
//# sourceMappingURL=authMiddleware.test.js.map