'use client';
import { FluidContainer } from '@/components/container/FluidContainer';
import { SectionWrapper } from '@/components/wrapper/SectionWrapper';

const UpdatePage = () => {
  return (
    <FluidContainer>
      <SectionWrapper title='Update history'>
        {Object.entries(UPDATE_LIST).map((updateItem) => {
          const [key, updateInfo] = updateItem;
          console.log('update info', updateInfo);
          return <UpdateItem updateInfo={updateInfo} />;
        })}
      </SectionWrapper>
    </FluidContainer>
  );
};

export default UpdatePage;

const UpdateItem = ({ updateInfo }: { updateInfo: any }) => {
  const { name, updateContent } = updateInfo;
  return (
    <div className='pl-4'>
      <div className='font-bold'>{name}</div>
      <ul className='list-disc'>
        {updateContent?.map((contentItem: any, idx: number) => {
          const { content, ex } = contentItem;
          return (
            <div className='ml-10' key={idx}>
              <li>{content}</li>
              {ex?.length > 0 && (
                <div>
                  <div className='text-muted-foreground'>Example:</div>
                  <div>
                    {ex.map((exItem: any) => (
                      <div> {exItem}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

const Tag = ({
  children,
  type = 'default',
}: {
  children: React.ReactNode;
  type?: string;
}) => {
  return (
    <span className='inline-block text-white rounded-md overflow-hidden mx-1'>
      <div
        className={
          type === 'default'
            ? 'px-2 bg-blue-500'
            : type === 'imp'
            ? 'px-2 bg-yellow-500'
            : type === 'exp'
            ? 'px-2 bg-red-500'
            : type === 'test'
            ? 'px-2 bg-green-500'
            : 'px-2 bg-blue-500'
        }
      >
        {children}
      </div>
    </span>
  );
};

const UPDATE_LIST = {
  '3/6/24': {
    name: '3/6/24 update',
    updateContent: [
      {
        content: (
          <div>
            Map detected allergen (contain, free of, on equipment) to enum value
            <Tag type='test'>Testing</Tag>
            <Tag type='imp'>Improving</Tag>
          </div>
        ),
        ex: [`"peanut" mapped into "peanut / peanut oil"`],
      },
      {
        content: (
          <div>
            Map detected "contain" and "does not contain" into enum value
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Add OCR text to validate input image for other data points
            <Tag type='exp'>Experimental</Tag>
          </div>
        ),
      },
    ],
  },
  '29/5/24': {
    name: '29/5/24 update',
    updateContent: [
      {
        content: (
          <div>
            Get ancillary info from supplement dietary ingredients (that could
            be sub-ingredients, equivalent substance, extra info, ...)
            <Tag type='test'>Testing</Tag>
            <Tag type='improve'>Improving</Tag>
          </div>
        ),
        ex: [
          `Riboflavin (as riboflavin)`,
          `Food Blend (Organic brown rice, organic broccoli)`,
        ],
      },
    ],
  },
};
