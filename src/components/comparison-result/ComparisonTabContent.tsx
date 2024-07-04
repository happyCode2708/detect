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
        />
      )}
      <TableResultTDC
        productTdcData={productTdcData}
        evaluation={compareResultData?.compareResult}
      />
    </div>
  );
};