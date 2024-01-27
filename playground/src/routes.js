import { lazy } from 'react';

import { NotFound } from 'component/ui';

const SampleDefinition = lazy(() => import('./pages/sample-definition'));
const SampleList = lazy(() => import('./pages/sample-list'));
const EditSample = lazy(() => import('./pages/sample-edit'));

export default [
  {
    name: 'SampleDefinition',
    module: '/playground',
    path: '/sample-definition',
    component: SampleDefinition,
    uiKey: 'u7e7c13a017',
  },
  {
    name: 'SampleList',
    module: '/playground',
    path: '/sample-list',
    component: SampleList,
    uiKey: 'u24bddfade6',
  },
  {
    name: 'EditSample',
    module: '/playground',
    path: '/sample-edit',
    component: EditSample,
    uiKey: 'u44dee8e3b3',
  },
  {
    name: 'NotFound',
    module: '/playground',
    path: '*',
    component: NotFound,
  },
];
