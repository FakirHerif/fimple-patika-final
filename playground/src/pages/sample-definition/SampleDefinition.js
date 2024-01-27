import React, { useState } from 'react';

import {
  useTranslation,
  scopeKeys,
} from 'component/base';
import {
  BasePage,
  Card,
  Input,
  withFormPage,
  Alert,
  InputFormat
} from 'component/ui';

const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u7e7c13a017',
};

const SampleDefinition = ({ close, Id, onSaveSuccess, ...rest }) => {
  const { translate } = useTranslation();
  const [alertInfo, setAlertInfo] = useState(null);

  const [dataModel, setDataModel] = useState({
    firstName: '',
    lastName: '',
    age: '',
    identificationNo: '',
    address: '',
    city: '',
    town: '',
    phone: '',
    title: '',
    content: '',
    informationsOwner: null,
    attachments: null,
  });

  const jsonData = {
    firstName: dataModel.firstName,
    lastName: dataModel.lastName,
    age: parseInt(dataModel.age, 10),
    identificationNo: parseInt(dataModel.identificationNo, 10),
    address: dataModel.address,
    city: dataModel.city,
    town: dataModel.town,
    phone: dataModel.phone,
    title: dataModel.title,
    content: dataModel.content,
    informationsOwner: null,
    attachments: null,
  };

  const formData = new FormData();
  formData.append('jsonData', JSON.stringify(jsonData));

  const onActionClick = async (action) => {
    if (action.commandName === 'Save') {
      try {
        console.log('Data to be sent:', dataModel);

        const response = await fetch('https://sendform.fly.dev/api/informations', {
          method: 'POST',
          body: formData,
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          console.log('Başarıyla kaydedildi');
          console.log('Response status:', response.status);
          console.log('Response data:', responseData);
          const referenceID = responseData && responseData.referenceID;
          setAlertInfo({
            message: referenceID
              ? `Form Sent Successfully! Your ReferenceID: ${referenceID}`
              : 'Form Sent Successfully!',
            severity: 'success',
          });
          setDataModel({
            firstName: '',
            lastName: '',
            age: '',
            identificationNo: '',
            address: '',
            city: '',
            town: '',
            phone: '',
            title: '',
            content: '',
            informationsOwner: null,
            attachments: null,
          })
          onSaveSuccess();
        } else {
          console.error('Error in response:', responseData);
          console.log('Response status:', response.status);
          console.error('Error Reasons:', responseData.Reasons);
          setAlertInfo({ message: 'Form Submission Failed', severity: 'error' });
        }
      } catch (error) {
        console.error('Error while creating a new record:', error);
      }
    } else if (action.commandName === 'Cancel') {
      close && close(false);
    }
  };

  return (
    <BasePage
      {...rest}
      onActionClick={onActionClick}
      actionList={[
        { name: 'Cancel' },
        { name: 'Save', scopeKey: scopeKeys.Create_Loan },
      ]}
    >
      {alertInfo && <Alert message={alertInfo.message} severity={alertInfo.severity} />}
      <Card scopeKey={scopeKeys.Create_Loan}>
        <Input
          xs={6}
          required
          label={translate('First Name')}
          value={dataModel.firstName}
          onChange={(value) => handleInputChange('firstName', value)}
          />
        <Input
          xs={6}
          required
          label={translate('Last Name')}
          value={dataModel.lastName}
          onChange={(value) => handleInputChange('lastName', value)}
        />
        <InputFormat
          required
          xs={2}
          label={translate('Age')}
          mask={/^[1-9]?[0-9]{1}$|^100$/}
          name="Number"
          placeholder="Only number"
          value={dataModel.age}
          onChange={(value) => handleInputChange('age', value)}
        />
        <InputFormat
          xs={4}
          required
          label={translate('Identification No')}
          mask={/^[1-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]{1,2}$|^99999999999$/}
          minLength={11}
          name="Number"
          placeholder="Only number"
          value={dataModel.identificationNo}
          onChange={(value) => handleInputChange('identificationNo', value)}
        />
        <Input
          xs={6}
          required
          label={translate('Address')}
          value={dataModel.address}
          onChange={(value) => handleInputChange('address', value)}
        />
        <Input
          xs={6}
          required
          label={translate('City')}
          value={dataModel.city}
          onChange={(value) => handleInputChange('city', value)}
        />
        <Input
          xs={6}
          required
          label={translate('Town')}
          value={dataModel.town}
          onChange={(value) => handleInputChange('town', value)}
        />
        <InputFormat
          xs={6}
          required
          label={translate('Phone Number')}
          mask={/^[1-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]{1,2}$|^9999999999$/}
          minLength={10}
          name="Number"
          placeholder="Only number"
          value={dataModel.phone}
          onChange={(value) => handleInputChange('phone', value)}
        />
        <Input
          xs={6}
          required
          label={translate('Title')}
          value={dataModel.title}
          onChange={(value) => handleInputChange('title', value)}
        />
        <Input
          xs={6}
          required
          label={translate('Content')}
          value={dataModel.content}
          onChange={(value) => handleInputChange('content', value)}
        />
      </Card>
    </BasePage>
  );
  function handleInputChange(fieldName, value) {
    setDataModel({ ...dataModel, [fieldName]: value });
  }
};

export default withFormPage(SampleDefinition, { uiMetadata });
