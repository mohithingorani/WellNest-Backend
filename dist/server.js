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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const therapistRoutes_1 = __importDefault(require("./routes/therapistRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./prisma"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//Body Parsing Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// CORS configuration
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
// API Routes
app.use("/therapist", therapistRoutes_1.default);
app.use("/user", userRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/ai", aiRoutes_1.default);
const port = process.env.PORT || 3000;
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma_1.default.$connect();
            console.log("✅ Database connected successfully");
        }
        catch (error) {
            console.error("Database connection failed: ", error);
            process.exit(1);
        }
    });
}
// Graceful shutdown
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🔄 Shutting down gracefully...");
    yield prisma_1.default.$disconnect();
    process.exit(0);
}));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🔄 Shutting down gracefully...");
    yield prisma_1.default.$disconnect();
    process.exit(0);
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectDatabase();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    });
}
// Start the server
startServer().catch((error) => {
    console.error("Failed to start server,error", error);
    process.exit(1);
});
