const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.category.create({
    data: {
      name: "Смартфоны",
      specSchema: {
        "Модельный год": "string",
        "Диагональ дисплея, дюйм": "number",
        "Разрешение дисплея": "string",
        "Тип матрицы": "string"
      }
    }
  });

  await prisma.category.create({
    data: {
      name: "Смарт-часы",
      specSchema: {
        "Серия": "string",
        "Операционная система": "string",
        "Форма корпуса часов": "string",
        "Диагональ, дюйм": "number"
      }
    }
  });

  await prisma.category.create({
    data: {
      name: "Камеры",
      specSchema: {
        "Формат матрицы": "string",
        "Диагональ дисплея, дюйм": "number",
        "Оптика в комплекте": "string",
        "Максимальная выдержка, с": "number"
      }
    }
  });

  await prisma.category.create({
    data: {
      name: "Наушники",
      specSchema: {
        "Назначение": "string",
        "Тип конструкции": "string",
        "Тип крепления": "string",
        "Тип подключения": "string"
      }
    }
  });

  await prisma.category.create({
    data: {
      name: "Компьютеры",
      specSchema: {
        "Графический процессор": "string",
        "Объем видеопамяти": "string",
        "Тип видеопамяти": "string",
        "Серия центрального процессора": "string"
      }
    }
  });
}

main()
  .then(() => {
    console.log("Seeding done");
  })
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
