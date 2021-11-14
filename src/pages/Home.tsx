import { 
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonToast,
  IonInput,
  useIonAlert,
  useIonViewDidEnter,
} from '@ionic/react';
import '../style/Home.css';
import { addCircle } from 'ionicons/icons';
import { useState } from 'react';
import { getListAllApartment, removeApartment } from '../databaseHandler';
import { Apartment } from '../apartment';

function showFurnitureTypes(furniture_type: string) {
  const FurnishedType = 'Furnished';
  const UnfurnishedType = 'Unfurnished';
  const PartFurnishedType = 'Part Furnished';

  if (furniture_type) {
    if (furniture_type === 'Furnished') {
      return FurnishedType;
    } else if (furniture_type === 'Unfurnished') {
      return UnfurnishedType;
    } else if (furniture_type === 'PartFurnished') {
      return PartFurnishedType;
    } else{
      return '';
    }
  }
}

const Home: React.FC = () => {
  const [rentalApartmentList, setRentalApartmentList] = useState<Apartment[]>([]);
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [confirmationModal] = useIonAlert();

  async function fetchData() {
    const listAllRentalApartment = await getListAllApartment();
    setRentalApartmentList(listAllRentalApartment);
  };

  useIonViewDidEnter(() => {
    fetchData();
  });

  async function handleRemoveApartment(id: number) {
    confirmationModal({
      header: 'Deletion Confirmation',
      message: `The deleted apartment can not be restore, are you sure to delete the apartment: 🏛 - ${id}?`,
      buttons: [
        'Return',
        { 
          text: 'Continue', 
          handler: async() => {
            await removeApartment(id);
            setMessage(`Delete apartment: 🏛 - ${id}, successfully !`);
            setShowToastMessage(true);
            setTimeout(()=>{
              setShowToastMessage(false);
            }, 5000);
            await fetchData();
          } 
        },
      ],
    });
  }

  async function searchApartment(event: any) {
    setSearchValue(event.detail.value);
    let listAllRentalApartment = await getListAllApartment();
    if (event.detail.value) {
      const regex = new RegExp(`${event.detail.value}.*`);
      let response = [];
      for (let item = 0; item < listAllRentalApartment.length; item++) {
        if (regex.test(listAllRentalApartment[item]['propertyType'])) {
          response.push(listAllRentalApartment[item])
        }
      }
      setRentalApartmentList(response);
    } else {
      setRentalApartmentList(listAllRentalApartment);
    }
  }

  return (
    <IonPage>

      {/* Application Header */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>🏩 Apartment Rental</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Application Content */}
      <IonContent fullscreen>
        <IonGrid>

          {/* Button Create New Apartment */}
          <IonRow>
            <IonCol>
              <IonButton size="default" color="dark" href="/create" expand="block">
                <IonIcon slot="start" icon={ addCircle }></IonIcon>
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Search Functionality */}
          <IonRow>
            <IonCol>
              <IonInput value={ searchValue } placeholder="🔎 Search" onIonChange={event => searchApartment(event)}></IonInput>
            </IonCol>
          </IonRow>

          {rentalApartmentList &&
            rentalApartmentList.map((rentalApartment, index) => 
              <IonCard key={index}>

                <IonCardHeader>
                  Rental Apartment ID: 🏛 - { rentalApartment.id }
                </IonCardHeader>

                <IonCardContent>
                  <h6>🗃 Property Type: { rentalApartment.propertyType }</h6>
                  <h6>🛌 Bedrooms: { rentalApartment.bedrooms }</h6>
                  <h6>📅 Date: { rentalApartment.date }</h6>
                  <h6>💰 Monthly Rent Price: { rentalApartment.monthlyRentPrice}</h6>
                  <h6>🚪 Furniture Types: { showFurnitureTypes(rentalApartment.furnitureTypes) }</h6>
                  <h6>📝 Notes: { rentalApartment.notes }</h6>
                  <h6>🔖 Name of The Reporter: { rentalApartment.nameReporter }</h6>

                  <IonRow>
                    <IonCol>
                      <IonButton 
                        size="default" 
                        color="warning" 
                        className="functional-btn" 
                        style={{ float: 'left' }}
                        routerLink={`/detail/${rentalApartment.id}`}
                      >Update
                      </IonButton>
                    </IonCol>

                    <IonCol>
                      <IonButton 
                        size="default" 
                        color="danger" 
                        className="functional-btn" 
                        style={{ float: 'right' }}
                        onClick={() => handleRemoveApartment(rentalApartment.id || -1)}
                      >Remove
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            )
          }

        </IonGrid>
      </IonContent>
      
      {/* Application Toast Message */}
      <IonToast isOpen={ showToastMessage } header="Success" message={ message } color="success" position="top"></IonToast>

    </IonPage>
  );
};

export default Home;
