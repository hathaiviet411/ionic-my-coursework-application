import { 
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonDatetime,
  IonRadioGroup,
  IonRadio,
  IonTextarea,
  IonButton,
  IonToast,
  useIonAlert,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { getApartmentById, updateApartment } from '../databaseHandler';
import { Apartment } from '../apartment';

function convertDateToYMD(date: string) {
  if (!date) {
    return '';
  }
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1);
  const day = newDate.getDate();

  return ymdFormatDate(year, month, day);
};

function ymdFormatDate(year: number, month: number, date: number) {
  if (!year && !month && !date) {
    return '';
  }

  return `${year}/${month}/${date}`;
};

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
interface MyParams {
  id: string,
}

const Update: React.FC = () => {
  const { id } = useParams<MyParams>();

  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [date, setDate] = useState('');
  const [monthlyRentPrice, setMonthlyRentPrice] = useState('');
  const [furnitureTypes, setFurnitureTypes] = useState('');
  const [notes, setNotes] = useState('');
  const [nameReporter, setNameReporter] = useState('');
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [headerMessage, setHeaderMessage] = useState('');
  const [message, setMessage] = useState('');
  const [colorMessage, setColorMessage] = useState('');
  const [confirmationModal] = useIonAlert();
  const history = useHistory();

  async function fetchData() {
    const apartment = await getApartmentById(Number.parseInt(id)) as Apartment;

    setPropertyType(apartment.propertyType);
    setBedrooms(apartment.bedrooms);
    setDate(apartment.date);
    setMonthlyRentPrice(apartment.monthlyRentPrice);
    setFurnitureTypes(apartment.furnitureTypes);
    setNotes(apartment.notes);
    setNameReporter(apartment.nameReporter);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitNewApartment = async() => {
    const RentalApplicationData = {
      propertyType,
      bedrooms,
      date: convertDateToYMD(date),
      monthlyRentPrice,
      furnitureTypes,
      notes,
      nameReporter,
    };

    if (RentalApplicationData.propertyType.length === 0) {
      setHeaderMessage('Warning');
      setMessage('Property Type is required !');
      setColorMessage('danger');
      setShowToastMessage(true);

      setTimeout(() => {
        setShowToastMessage(false);
      }, 3000)
    } else if (RentalApplicationData.bedrooms.length === 0) {
      setHeaderMessage('Warning');
      setMessage('Bedrooms is required !');
      setColorMessage('danger');
      setShowToastMessage(true);

      setTimeout(() => {
        setShowToastMessage(false);
      }, 3000)
    } else if (RentalApplicationData.date.length === 0) {
      setHeaderMessage('Warning');
      setMessage('Date of the added property is required !');
      setColorMessage('danger');
      setShowToastMessage(true);

      setTimeout(() => {
        setShowToastMessage(false);
      }, 3000)
    } else if (RentalApplicationData.monthlyRentPrice.length === 0) {
      setHeaderMessage('Warning');
      setMessage('Monthly rent price is required !');
      setColorMessage('danger');
      setShowToastMessage(true);

      setTimeout(() => {
        setShowToastMessage(false);
      }, 3000)
    } else if (RentalApplicationData.furnitureTypes.length === 0) {
      setHeaderMessage('Warning');
      setMessage(`Furniture type is required !`);
      setColorMessage('danger');
      setShowToastMessage(true);

      setTimeout(() => {
        setShowToastMessage(false);
      }, 3000)
    } else {
      confirmationModal({
        header: `Update Apartment - ${id} Confirmation`,
        message: `
          <h6>Apartment - ${id} will be update with the following data: </h6>
          <div>Property Type: ${RentalApplicationData.propertyType}</div>
          <div>Bedrooms: ${RentalApplicationData.bedrooms}</div>
          <div>Date: ${RentalApplicationData.date}</div>
          <div>Monthly Rent Price: ${RentalApplicationData.monthlyRentPrice}</div>
          <div>Furniture Types: ${showFurnitureTypes(RentalApplicationData.furnitureTypes)}</div>
          <div>Notes: ${RentalApplicationData.notes}</div>
          <div>Name Reporter: ${RentalApplicationData.nameReporter}</div>
        `,
        buttons: [
          'Return',
          { 
            text: 'Continue', 
            handler: async() => {
              await updateApartment(RentalApplicationData, parseInt(id));

              setHeaderMessage('Success');
              setMessage('Updated Apartment Successfully !');
              setColorMessage('success');
              setShowToastMessage(true);
              history.push('/home');
        
              setTimeout(()=>{
                setShowToastMessage(false);
              }, 5000)
            } 
          },
        ],
      });
    }
  };

  const handleResetData = () => {
    confirmationModal({
      header: 'Reset all entered data.',
      message: `
        <h6>All the following data will be delete, are you sure ?</h6>
        <div>Property Type: ${propertyType}</div>
        <div>Bedrooms: ${bedrooms}</div>
        <div>Date: ${convertDateToYMD(date)}</div>
        <div>Monthly Rent Price: ${monthlyRentPrice}</div>
        <div>Furniture Types: ${showFurnitureTypes(furnitureTypes)}</div>
        <div>Notes: ${notes}</div>
        <div>Name Reporter: ${nameReporter}</div>
      `,
      buttons: [
        'Return',
        { 
          text: 'Continue', 
          handler: () => {
            setPropertyType('');
            setBedrooms('');
            setDate('');
            setMonthlyRentPrice('');
            setFurnitureTypes('');
            setNotes('');
            setNameReporter('');
          } 
        },
      ],
    });
  }

  return (
    <IonPage>

      {/* Application Header */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Update Screen</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Application Content */}
      <IonContent fullscreen>
        <IonGrid>

          {/* Property Type */}
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">🗃 Property type</IonLabel>
              <IonSelect
                value={ propertyType }
                onIonChange={event => setPropertyType(event.detail.value)}
                placeholder="Please Select Property Type."
              >
                <IonSelectOption value="Flat">Flat</IonSelectOption>
                <IonSelectOption value="House">House</IonSelectOption>
                <IonSelectOption value="Bungalow">Bungalow</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>

          {/* Bedrooms */}
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">🛌 Bedrooms</IonLabel>
              <IonInput
                value={ bedrooms }
                type="number"
                onIonChange={event => setBedrooms(event.detail.value!)}
                placeholder="Please Enter The Number of The Bedrooms."
              ></IonInput>
            </IonCol>
          </IonRow>

          {/* Date of The Added Property */}
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">📅 Date</IonLabel>
              <IonDatetime
                value={ date }
                onIonChange={event => setDate(event.detail.value!)} 
                display-format="YYYY/MM/DD" 
                placeholder="Please Select The Date of The Added Property."
              ></IonDatetime>
            </IonCol>
          </IonRow>

          {/* Monthly Rent Price */}
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">💰 Monthly Rent Price</IonLabel>
              <IonInput 
                value={ monthlyRentPrice }
                type="number"
                onIonChange={event => setMonthlyRentPrice(event.detail.value!)} 
                placeholder="Please Enter Monthly Rent Price."
              ></IonInput>
            </IonCol>
          </IonRow>

          {/* Furniture Types */}
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">🚪 Furniture Types</IonLabel>

              <IonRadioGroup value={ furnitureTypes } onIonChange={event => setFurnitureTypes(event.detail.value)} style={{ marginTop: '10px' }}>
              <IonItem>
                <IonLabel><small>Furnished</small></IonLabel>
                <IonRadio slot="start" value="Furnished"></IonRadio>
              </IonItem>

              <IonItem>
                <IonLabel><small>Unfurnished</small></IonLabel>
                <IonRadio slot="start" value="Unfurnished"></IonRadio>
              </IonItem>

              <IonItem>
                <IonLabel><small>Part Furnished</small></IonLabel>
                <IonRadio slot="start" value="PartFurnished"></IonRadio>
              </IonItem>
            </IonRadioGroup>

            </IonCol>
          </IonRow>

          {/* Notes */}
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">📝 Notes</IonLabel>
              <IonTextarea value={ notes } onIonChange={event => setNotes(event.detail.value!)} placeholder="Please Enter Notes"></IonTextarea>
            </IonCol>
          </IonRow>

          {/* Name of The Reporter */}
          <IonRow>
            <IonCol>
              <IonLabel position="stacked">🔖 Name of The Reporter</IonLabel>
              <IonInput value={ nameReporter } onIonChange={event => setNameReporter(event.detail.value!)} placeholder="Input name reporter"></IonInput>
            </IonCol>
          </IonRow>

          {/* Button Submit */}
          <IonRow>
            <IonCol>
              <IonButton color="success" expand="block" onClick={ handleSubmitNewApartment }>🗃 Update</IonButton>
            </IonCol>
          </IonRow>

          {/* Button Reset */}
          <IonButton color="danger" expand="block" onClick={ handleResetData }>🧼️ Reset</IonButton>

        </IonGrid>
      </IonContent>

      {/* Application Toast Message */}
      <IonToast isOpen={ showToastMessage } header={ headerMessage } message={ message } color={ colorMessage } position="top"></IonToast>

    </IonPage>
  );
};

export default Update;
