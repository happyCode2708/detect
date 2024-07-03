import { TableResult } from '../result/TableResult';
import { TableResultTDC } from '../result/TableResultTDC';

export const ComparisonTabContent = ({
  productInfo1,
  productInfo2,
  productTdcData,
}: {
  productInfo1: any;
  productInfo2: any;
  productTdcData: any;
}) => {
  return (
    <div className='grid grid-cols-2'>
      <TableResult productInfo={productInfo1} />
      <TableResultTDC productTdcData={productTdcData} />
    </div>
  );
};
