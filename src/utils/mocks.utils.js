import { fakerES as faker } from '@faker-js/faker';

export const generateCode = () => {
    return faker.string.alphanumeric(10)
}
export const generateProducts = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(6),
        price: faker.commerce.price({ min: 1, max: 200, dec: 0 }),
        stock: faker.number.int({ min: 1, max: 300 }),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(0.9),
        thumbnails: faker.image.url(),
    }
}