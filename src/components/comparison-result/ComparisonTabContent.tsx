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
  // console.log('mapped', compareResultData);

  return (
    <div
      className={
        compareResultData?.mappedExtractToTdc &&
        process.env.NODE_ENV !== 'production'
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
      {process.env.NODE_ENV !== 'production' && (
        <>
          {compareResultData?.compareResult && (
            <TableResultTDC
              productTdcData={productTdcData}
              evaluation={compareResultData?.compareResult}
              key='2'
            />
          )}
        </>
      )}
    </div>
  );
};
