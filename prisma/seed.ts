import { Prisma, PrismaClient } from "@prisma/client";

await main()

async function main() {
    const prisma = new PrismaClient({
    })

    const deviceTypes: Prisma.DeviceTypeCreateInput[] = [
        { value: "desktop" },
        { value: "laptop" },
        { value: "mobile" },
        { value: "server" },
        { value: "other" }
    ]

    for (let dt of deviceTypes) {
        await prisma.deviceType.upsert({
            where: dt,
            create: dt,
            update: {}
        })
    }
    
    await prisma.user.upsert({
        where: {
            username: "test"
        },
        create: {
            username: "test",
            password: {
                create: {
                    value: "password"
                }
            }
        },
        update: {}
    })
}