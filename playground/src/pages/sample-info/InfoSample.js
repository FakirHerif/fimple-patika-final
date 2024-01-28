import React, { useEffect, useState } from 'react';

import {
  useTranslation,
  scopeKeys,
} from 'component/base';
import {
  BasePage,
  Card,
  withFormPage,
  Alert,
  InformationText,
  LabelText,
  IconButton
} from 'component/ui';

const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u44dee8e3b3',
};

const InfoSample = ({ close, id, onSaveSuccess, ...rest }) => {
  const { translate } = useTranslation();
  const [alertInfo, setAlertInfo] = useState(null);
  const [responseText, setResponseText] = useState("");
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
    response: rest.data.response
  });

  useEffect(() => {
      console.log('Updating dataModel with:', rest.data);
      setDataModel((prevDataModel) => ({
        ...prevDataModel,
        ...rest.data,
      }));
  }, [rest.data, rest.data.id]);

const onCommentChange = (event) => {
  setResponseText(event.target.value);
  console.log('Current responseText:', event.target.value);
};

  const onActionClick = async (action) => {
    if (action.commandName === 'Send') {
      try {
        console.log('RESPONSEEEEEEEEEEEE', responseText);
        console.log('RESPONSEEEEEEEEEEEE', jsonData);

        const informationsId = rest.data.id;
        const jsonData = {
          informationsId: informationsId,
          responseOwner: "Patika",
          responseText: responseText || ''
        };

        const response = await fetch(`https://sendform.fly.dev/api/response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });

        const responseData = await response.json();

        if (response.ok) {
          console.log('Response Successfully sended');
          setAlertInfo({
            message: 'Response Send Successfully!',
            severity: 'success',
          });
          onSaveSuccess();
          setResponseText("");
      /*  setTimeout(() => {
            close();
          }, 500) */
         
          const updatedDataResponse = await fetch(`https://sendform.fly.dev/api/informations/${informationsId}`);
          const updatedData = await updatedDataResponse.json();

          const responseArray = updatedData.data.response || [];

          setDataModel((prevDataModel) => ({
            ...prevDataModel,
            response: responseArray,
          }));

        } else {
          console.error('Error in response:', responseData);
          setAlertInfo({ message: 'Response Send Failed', severity: 'error' });
        }
      } catch (error) {
        console.error('Error while updating the record:', error);
      }
    } else if (action.commandName === 'Cancel') {
      close && close(false);
    }
  };

  const onDeleteComment = async (index) => {
    try {
      const responseIdToDelete = dataModel.response[index].id;

      const response = await fetch(`https://sendform.fly.dev/api/response/${responseIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Comment deleted successfully');
        setAlertInfo({
          message: 'Comment deleted successfully!',
          severity: 'warning',
        });

        setDataModel((prevDataModel) => ({
          ...prevDataModel,
          response: prevDataModel.response.filter((_, i) => i !== index),
        }));
        onSaveSuccess();
      } else {
        console.error('Error deleting comment:', response.statusText);
        setAlertInfo({
          message: 'Failed to delete comment!',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <BasePage
      {...rest}
      onActionClick={onActionClick}
      actionList={[
        { name: 'Cancel' },
        { name: 'Send', scopeKey: scopeKeys.Create_Loan },
      ]}
    >
      {alertInfo && <Alert message={alertInfo.message} severity={alertInfo.severity} />}
      <Card scopeKey={scopeKeys.Create_Loan}>
      <InformationText
          xs={3}
          title={translate('First Name')}
          subtitle={dataModel.firstName}
      />
        <InformationText
          xs={3}
          title={translate('Last Name')}
          subtitle={dataModel.lastName}
        />
        <InformationText
          xs={3}
          title={translate('Age')}
          subtitle={dataModel.age}
        />
        <InformationText
          xs={3}
          title={translate('Identification No')}
          subtitle={dataModel.identificationNo}
        />
        <InformationText
          xs={3}
          title={translate('Phone Number')}
          subtitle={dataModel.phone}
        />
        <InformationText
          xs={3}
          title={translate('City')}
          subtitle={dataModel.city}
        />
        <InformationText
          xs={3}
          title={translate('Town')}
          subtitle={dataModel.town}
        />
        <InformationText
          xs={3}
          title={translate('Address')}
          subtitle={dataModel.address}
        />
        <InformationText
          xs={3}
          title={translate('Status')}
          subtitle={dataModel.status}
        />
        <InformationText
          xs={6}
          title={translate('Reference Id')}
          subtitle={dataModel.referenceID}
        />
        <InformationText
          xs={3}
          title={translate('Created Date')}
          subtitle={dataModel.createdDate}
        />
        <InformationText
          xs={12}
          title={translate('Title')}
          subtitle={dataModel.title}
        />
        <InformationText
          rows={8}
          xs={12}
          multiline
          title={translate('Content')}
          subtitle={dataModel.content}
        />
        <hr/>
        <LabelText
          title={translate('Comment')}
        />
        <textarea 
          style={{ width: '100%' }}
          rows={4}
          multiline
          value={responseText}
          onChange={onCommentChange}
        />
        {dataModel.response && dataModel.response.map((responseItem, index) => (
          <Card key={index} scopeKey={scopeKeys.Create_Loan}>
            <InformationText
              title={translate('Response')}
              subtitle={responseItem.responseText}
            />
            <InformationText
              xs={9}
              title={translate('Written by')}
              subtitle={responseItem.responseOwner}
            />
            <InformationText
              xs={3}
              title={translate('Date')}
              subtitle={responseItem.replyDate}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              icon="delete"
              color="error"
              tooltip={translate('Delete')}
              onClick={() => onDeleteComment(index)}
            />
            </div>
          </Card>
        ))}
      </Card>
    </BasePage>
  );
};

InfoSample.displayName = 'InfoSample';

export default withFormPage(InfoSample, { uiMetadata });
