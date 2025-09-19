"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = require("argon2");
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await argon2.hash('Adm123!');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@teste.com' },
        update: {},
        create: {
            userName: 'admin',
            email: 'admin@teste.com',
            name: 'Administrador',
            passwordHash,
            authProvider: 'local',
            role: 'ADMIN',
        },
    });
    console.log('Admin criado:', admin);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map