import type { BusinessRecord } from '../types';

const ALL_RECORDS: BusinessRecord[] = [
  { id: '1', name: 'Accra Tech Solutions Limited', type: 'Private Limited Company', regNumber: 'CS120450120', status: 'Active', registeredDate: '2019-03-14', region: 'Greater Accra' },
  { id: '2', name: 'Gold Coast Ventures Ghana', type: 'Private Limited Company', regNumber: 'CS098731245', status: 'Active', registeredDate: '2017-07-22', region: 'Greater Accra' },
  { id: '3', name: 'Kumasi Agro Supplies Ltd', type: 'Sole Proprietorship', regNumber: 'CS045231089', status: 'Inactive', registeredDate: '2014-11-05', region: 'Ashanti' },
  { id: '4', name: 'Ghana Digital Services Co.', type: 'Public Limited Company', regNumber: 'CS201834567', status: 'Active', registeredDate: '2021-01-18', region: 'Greater Accra' },
  { id: '5', name: 'Volta River Enterprises', type: 'Company Limited by Guarantee', regNumber: 'CS078923412', status: 'Struck Off', registeredDate: '2012-06-30', region: 'Volta' },
  { id: '6', name: 'Northern Star Trading Ltd', type: 'Partnership', regNumber: 'CS034512678', status: 'Dissolved', registeredDate: '2010-04-15', region: 'Northern' },
  { id: '7', name: 'Tema Port Logistics Ltd', type: 'External Company', regNumber: 'CS156784321', status: 'Active', registeredDate: '2020-09-03', region: 'Greater Accra' },
  { id: '8', name: 'Cape Coast Fisheries Ghana', type: 'Unlimited Company', regNumber: 'CS023456789', status: 'Active', registeredDate: '2016-02-28', region: 'Central' },
  { id: '9', name: 'Sunyani Farm Produce Ltd', type: 'Sole Proprietorship', regNumber: 'CS067891234', status: 'Inactive', registeredDate: '2015-08-12', region: 'Bono' },
  { id: '10', name: 'Tamale Construction Works', type: 'Private Limited Company', regNumber: 'CS089012345', status: 'Active', registeredDate: '2018-12-07', region: 'Northern' },
  { id: '11', name: 'Accra Metro Real Estate Ltd', type: 'Private Limited Company', regNumber: 'CS192837465', status: 'Active', registeredDate: '2022-03-19', region: 'Greater Accra' },
  { id: '12', name: 'GreenGold Agribusiness Ghana', type: 'Partnership', regNumber: 'CS172839401', status: 'Active', registeredDate: '2021-07-11', region: 'Eastern' },
  { id: '13', name: 'Obuasi Mining Supplies Ltd', type: 'Limited Company', regNumber: 'CS045671230', status: 'Struck Off', registeredDate: '2013-05-27', region: 'Ashanti' },
  { id: '14', name: 'Ho Export Trading Company', type: 'Private Company Limited', regNumber: 'CS012345987', status: 'Active', registeredDate: '2019-10-14', region: 'Volta' },
  { id: '15', name: 'West Africa Pharma Ltd', type: 'Private Limited Company', regNumber: 'CS182736450', status: 'Active', registeredDate: '2023-01-05', region: 'Greater Accra' },
  { id: '16', name: 'Bolgatanga Crafts Limited', type: 'Sole Proprietorship', regNumber: 'CS009876543', status: 'Dissolved', registeredDate: '2009-11-22', region: 'Upper East' },
  { id: '17', name: 'Takoradi Port Services Ltd', type: 'External Company', regNumber: 'CS162738495', status: 'Active', registeredDate: '2020-05-30', region: 'Western' },
  { id: '18', name: 'Kumasi Tech Hub Company', type: 'Public Limited Company', regNumber: 'CS172645830', status: 'Active', registeredDate: '2022-08-17', region: 'Ashanti' },
];

export function searchRecords(query: string, filter: 'contains' | 'exact' | 'starts' | 'ends'): BusinessRecord[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();

  return ALL_RECORDS.filter(({ name }) => {
    const n = name.toLowerCase();
    if (filter === 'exact')    return n === q;
    if (filter === 'starts')   return n.startsWith(q);
    if (filter === 'ends')     return n.endsWith(q);
    return n.includes(q); // contains
  });
}
