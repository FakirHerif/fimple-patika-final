import React, { useEffect, useMemo, useState, useCallback } from 'react';

import {
  useFiProxy,
  useFormManagerContext,
  useTranslation,
  scopeKeys,
} from 'component/base';
import { Card, DataGrid, Filter, BasePage, withFormPage, Select, Alert } from 'component/ui';

import SampleDefinition from '../sample-definition';

const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u24bddfade6',
};

const SampleList = (props) => {
  const { showDialog } = useFormManagerContext();
  const [dataSource, setDataSource] = useState([]);
  const { translate } = useTranslation();
  const [deleteAlert, setDeleteAlert] = useState(null);

  const { executeGet, executeDelete } = useFiProxy();

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = (data) => {

     executeGet({ fullURL: `https://sendform.fly.dev/api/informations`, enqueueSnackbarOnError: false })
     .then((response) => {
        console.log(response.data);
/*         if (response.data) {
          response.data.forEach(item => {
            console.log('First Name:', item.firstName);
            console.log('Last Name:', item.lastName);
          }); */
          if (data && data.status) {
            const filteredData = response.data.filter((item) => item.status === data.status);
            setDataSource(filteredData);
            console.log(filteredData);
          } else {
            setDataSource(response.data);
          }
/*      } else {
      console.log('API Response does not have the expected structure.');
     } */
    })
       .catch((error) => {
        console.log("Error");
        console.error('Error fetching data:', error);
       });
     };

     const deleteData = (id) => {
      console.log(id)
      if (deleteClicked) {
        executeDelete({ fullURL: `https://sendform.fly.dev/api/informations/${id}`, data: {}, enqueueSnackbarOnError: false })
          .then(() => {
            getDataSource();
            setDeleteAlert({ message: 'Data deleted successfully!', severity: 'warning' });
            setTimeout(() => {
              setDeleteAlert(null);
            }, 5000);
          })
          .catch((error) => {
            console.error('Error deleting data:', error);
            console.error('Response data:', id); // Log the response data for debugging
            setDeleteAlert({ message: 'Failed to delete data!', severity: 'error' });
            setTimeout(() => {
              setDeleteAlert(null);
            }, 5000);
          });
      } else {
        console.log("Error: apiResponse is not defined");
      }
    };

    const onSaveSuccess = () => {
      getDataSource();
    };

  const columns = useMemo(() => {
    return [
      { name: 'id', header: translate('Id'), visible: true },
      { name: 'firstName', header: translate('First Name') },
      { name: 'lastName', header: translate('Last Name') },
      { name: 'age', header: translate('Age') },
      { name: 'identificationNo', header: translate('Identification No'), },
      { name: 'phone', header: translate('Phone Number') },
      { name: 'town', header: translate('Town') },
      { name: 'city', header: translate('City') },
      { name: 'address', header: translate('Address') },
      { name: 'title', header: translate('Title') },
      { name: 'content', header: translate('Content') },
      { name: 'referenceID', header: translate('Reference Id') },
      { name: 'status', header: translate('Status') },
      { name: 'createdDate', header: translate('Created Date') },

    ];
  }, []);

  const onActionClick = (action) => { };

  const addClicked = useCallback(() => {
    showDialog({
      title: translate('Sample add'),
      content: <SampleDefinition onSaveSuccess={onSaveSuccess}/>,
      callback: (data) => {
        if (data) {
          getDataSource();
        }
      },
    });
  }, [onSaveSuccess]);

  const editClicked = useCallback((id, data) => {
    data &&
      showDialog({
        title: translate('Sample edit'),
        content: <SampleDefinition data={data} />,
        callback: () => {
          getDataSource();
        },
      });
  }, []);

  const deleteClicked = useCallback((id, data) => {
    data && deleteData(data.id);
  }, [deleteData]);

  const gridActionList = useMemo(
    () => [
      {
        name: 'delete',
        onClick: deleteClicked,
        scopeKey: scopeKeys.Create_Loan,
      },
      {
        name: 'edit',
        onClick: editClicked,
        scopeKey: scopeKeys.Create_Loan,
      },
    ],
    [deleteClicked, editClicked]
  );

  const cardActionList = useMemo(
    () => [
      {
        name: 'Add',
        icon: 'add',
        onClick: addClicked,
        scopeKey: scopeKeys.Create_Loan,
      },
    ],
    [addClicked]
  );

  return (
    <BasePage {...props} onActionClick={onActionClick}>
            {deleteAlert && <Alert message={deleteAlert.message} severity={deleteAlert.severity} />}
      <Filter
        onFilter={(data) => getDataSource(data)}
        onFilterReset={(data) =>getDataSource(data)}
      >
        <Select
          name={'status'}
          label={translate('Status')}
          primaryFilter
          datasource={[
            { label: 'çözüldü', value: 'çözüldü' },
            { label: 'iptal edildi', value: 'iptal edildi' },
            { label: 'cevap bekliyor', value: 'cevap bekliyor' },
          ]}
        />
      </Filter>
      <Card
        scopeKey={scopeKeys.View_Loan}
        showHeader={true}
        actionList={cardActionList}
      >
        <DataGrid
          dataSource={dataSource}
          columns={columns}
          actionList={gridActionList}
          autoSizeAllColumns
          idProperty="Id"
        />
      </Card>
    </BasePage>
  );
};
SampleList.displayName = 'SampleList';

export default withFormPage(SampleList, { uiMetadata });
