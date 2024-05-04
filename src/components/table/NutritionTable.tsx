import React from 'react';

const NutritionTable = ({ data }: { data: any }) => {
  return (
    <div className='pb-4'>
      <div className='text-2xl font-bold mb-2'>{data.panelName}</div>
      <table>
        <thead>
          <tr>
            <th>Nutrient Name</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='px-2 w-[250px]'>Amount Per Serving</td>
            <td className='px-2'>
              {data?.amountPerServing?.value}
              {data?.amountPerServing?.uom !== null && (
                <span>{data?.amountPerServing?.uom}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className='px-2 w-[250px]'>Serving Size</td>
            <td className='px-2 w-[400px]'>
              {data?.servingSize?.value}
              {data?.servingSize?.uom !== null && (
                <span>{data?.servingSize?.uom}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className='px-2 w-[250px]'>Serving Per Container</td>
            <td className='px-2 w-[400px]'>
              {data?.servingPerContainer?.value}
              {data?.servingPerContainer?.uom !== null && (
                <span>{data?.servingPerContainer?.uom}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className='px-2 w-[250px]'>Amount Per Serving</td>
            <td className='px-2 w-[400px]'>
              {data?.amountPerServing?.value}
              {data?.amountPerServing?.uom !== null && (
                <span>{data?.amountPerServing?.uom}</span>
              )}
            </td>
          </tr>
          {data.nutrients.map((nutrient: any, index: number) => (
            <tr key={index}>
              <td className='px-2 w-[250px]'>{nutrient.name}</td>
              <td className='px-2 w-[400px]' key={index}>
                {nutrient?.value}
                {nutrient?.uom !== null && <span>{nutrient?.uom}</span>}
                {nutrient.percentDailyValue !== null && (
                  <span>({nutrient.percentDailyValue}%)</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NutritionTable;
