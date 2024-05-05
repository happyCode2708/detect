import NutritionTable from '@/components/table/NutritionTable';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Result = ({ reply }: { reply: any }) => {
  if (!reply || reply?.length <= 0) return null;

  return (
    <Tabs defaultValue='table' className='w-full overflow-hidden'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='table'>Table</TabsTrigger>
        <TabsTrigger value='json'>Json</TabsTrigger>
      </TabsList>
      <TabsContent value='table'>
        <TableResult reply={reply} />
      </TabsContent>
      <TabsContent value='json'>
        <JsonRender reply={reply} />
      </TabsContent>
    </Tabs>
  );
};

const TableResult = ({ reply }: { reply: any }) => {
  return (
    <>
      {reply && reply?.length > 0 ? (
        <div className='p-4 border rounded-md flex-1 overflow-auto max-h-[500px]'>
          {reply.map((labelData: any, idx: number) => {
            return <NutritionTable data={labelData} key={idx} />;
          })}
        </div>
      ) : null}
    </>
  );
};

const JsonRender = ({ reply }: { reply: any }) => {
  return (
    <pre className='bg-zinc-100 p-4 rounded-sm max-h-[500px] overflow-auto'>
      {JSON.stringify(reply, null, 2)}
    </pre>
  );
};
