import { openDB } from 'idb';
import { Apartment } from './apartment';

const DATABASE = 'Apartment';
const TABLE = 'table_apartment';

async function initDB() {
  const db = await openDB(DATABASE, 1, {
    upgrade(db) {
      const store = db.createObjectStore(TABLE, {
        keyPath: 'id',
        autoIncrement: true,
      }); 
    }
  });
};

initDB().then(() => {
  console.log('Database Initiation Successfully !');
});

export async function createApartment(apartment: any) {
  const db = await openDB(DATABASE, 1);

  await db.put(TABLE, apartment)
    .then(() => {
      console.log('Created ', apartment, ' successfully !');
    })
    .catch((err) => {
      console.log('An Error Occurred.');
      console.log(err);
    });
};

export async function updateApartment(dataUpdate: any, id: number) {
  const db = await openDB(DATABASE, 1);

  const apartment = await db.transaction(TABLE).objectStore(TABLE).get(id) as Apartment;

  apartment.propertyType = dataUpdate.propertyType;
  apartment.bedrooms = dataUpdate.bedrooms;
  apartment.date = dataUpdate.date;
  apartment.monthlyRentPrice = dataUpdate.monthlyRentPrice;
  apartment.furnitureTypes = dataUpdate.furnitureTypes;
  apartment.notes = dataUpdate.notes;
  apartment.nameReporter = dataUpdate.nameReporter;

  await db.put(TABLE, apartment)
    .then(() => {
      console.log(`Updated apartment: 🏛 - ${id}`, ' successfully !');
      console.log(apartment);
    })
    .catch((err) => {
      console.log('An Error Occurred.');
      console.log(err);
    });
};

export async function removeApartment(id: number) {
  const db = await openDB(DATABASE, 1);

  await db.delete(TABLE, id)
    .then(() => {
      console.log(`Delete apartment: 🏛 - ${id}`, ' successfully !');
    })
    .catch((err) => {
      console.log('An Error Occurred.');
      console.log(err);
    });
};

export async function getApartmentById(id: number) {
  const db = await openDB(DATABASE, 1);
  const apartment = await db.transaction(TABLE).objectStore(TABLE).get(id);

  return apartment;
}

export async function getListAllApartment() {
  const db = await openDB(DATABASE, 1);

  let apartment = await db.transaction(TABLE).objectStore(TABLE).openCursor();

  let allExistedApartment = [];

  while (apartment) {
    allExistedApartment.push(apartment.value);

    apartment = await apartment.continue();
  };

  return allExistedApartment;
};