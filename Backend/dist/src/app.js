"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db")); // Assuming db.ts exports connectDB as default
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Ensure userRoutes.ts exports default router
(0, db_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/users', userRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, PixelPals!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map