import { TableResult } from '../result/TableResult';
import { TableResultTDC } from '../result/TableResultTDC';

export const ComparisonTabContent = ({
  productInfo,
  productTdcData,
  compareResultData,
}: {
  productInfo: any;
  productTdcData: any;
  compareResultData: any;
}) => {
  console.log('mapped', compareResultData);

  console.log('tdc', productTdcData);
  return (
    <div
      className={
        compareResultData?.mappedExtractToTdc
          ? 'grid grid-cols-3'
          : 'grid grid-cols-2'
      }
    >
      <TableResult productInfo={productInfo} />
      {compareResultData?.mappedExtractToTdc && (
        <TableResultTDC
          productTdcData={compareResultData?.mappedExtractToTdc}
          key='1'
        />
      )}
      {compareResultData?.compareResult && (
        <TableResultTDC
          productTdcData={productTdcData}
          evaluation={compareResultData?.compareResult}
          key='2'
        />
      )}
    </div>
  );
};
