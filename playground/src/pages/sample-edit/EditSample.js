import React, { useEffect, useState } from 'react';

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
  InputFormat,
  Select
} from 'component/ui';

const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u44dee8e3b3',
};

const EditSample = ({ close, id, onSaveSuccess, ...rest }) => {
  const { translate } = useTranslation();
  const [alertInfo, setAlertInfo] = useState(null);
  const [dataModel, setDataModel] = useState({
    firstName: rest.data.firstName,
    lastName: rest.data.lastName,
    age: rest.data.age || 0,
    identificationNo: rest.data.identificationNo || 0,
    address: rest.data.address,
    city: rest.data.city,
    town: rest.data.town,
    phone: rest.data.phone,
    title: rest.data.title,
    content: rest.data.content,
    status: rest.data.status,
    referenceID: rest.data.referenceID,
    createdDate: rest.data.createdDate,
    informationsOwner: null,
    attachments: null,
  });

  useEffect(() => {
    if (rest.Id) {
      setDataModel((prevDataModel) => ({
        ...prevDataModel,
        ...rest.data,
      }));
    }
  }, [rest.data, rest.Id]);

  const onActionClick = async (action) => {
    if (action.commandName === 'Save') {
      try {
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
          status: dataModel.status,
          informationsOwner: null,
          attachments: null,
        };

        const response = await fetch(`https://sendform.fly.dev/api/informations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });

        const responseData = await response.json();

        if (response.ok) {
          console.log('Successfully updated');
          setAlertInfo({
            message: 'Form Updated Successfully!',
            severity: 'success',
          });
          onSaveSuccess();
        } else {
          console.error('Error in response:', responseData);
          setAlertInfo({ message: 'Form Update Failed', severity: 'error' });
        }
      } catch (error) {
        console.error('Error while updating the record:', error);
      }
    } else if (action.commandName === 'Cancel') {
      close && close(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setDataModel((prevDataModel) => ({
      ...prevDataModel,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    let timeoutId;

    if (alertInfo && alertInfo.severity === 'success') {
      timeoutId = setTimeout(() => {
        close && close(false);
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [alertInfo, close]);

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
        <Input
          required
          xs={2}
          label={translate('Age')}
          maxLength={2}
          placeholder="Only number"
          value={dataModel.age}
          onChange={(value) => handleInputChange('age', value)}
        />
        <Input
          xs={4}
          required
          label={translate('Identification No')}
          minLength={11}
          maxLength={11}
          placeholder="Only number"
          value={dataModel.identificationNo}
          onChange={(value) => handleInputChange('identificationNo', value)}
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
        <Input
          xs={8}
          required
          label={translate('Address')}
          value={dataModel.address}
          onChange={(value) => handleInputChange('address', value)}
        />
        <Select
          datasource={[
            { label: 'çözüldü', value: 'çözüldü' },
            { label: 'iptal edildi', value: 'iptal edildi' },
            { label: 'cevap bekliyor', value: 'cevap bekliyor' },
          ]}
          value={dataModel.status}
          required
          label={dataModel.status}
          primaryFilter
          xs={4}
          defaultValue={dataModel.status}
          onChange={(value) => handleInputChange('status', value)}
        />
        <Input
          xs={8}
          required
          disabled
          label={translate('Reference Id')}
          value={dataModel.referenceID}
          onChange={(value) => handleInputChange('referenceID', value)}
        />
        <Input
          xs={4}
          required
          disabled
          label={translate('Created Date')}
          value={dataModel.createdDate}
          onChange={(value) => handleInputChange('createdDate', value)}
        />
        <Input
          xs={12}
          required
          label={translate('Title')}
          value={dataModel.title}
          onChange={(value) => handleInputChange('title', value)}
        />
        <Input
          rows={8}
          xs={12}
          multiline
          required
          label={translate('Content')}
          value={dataModel.content}
          onChange={(value) => handleInputChange('content', value)}
        />
      </Card>
    </BasePage>
  );
};

EditSample.displayName = 'EditSample';

export default withFormPage(EditSample, { uiMetadata });
