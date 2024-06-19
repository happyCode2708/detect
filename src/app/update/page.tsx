'use client';
import { FluidContainer } from '@/components/container/FluidContainer';
import { Button, buttonVariants } from '@/components/ui/button';
import { SectionWrapper } from '@/components/wrapper/SectionWrapper';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const UpdatePage = () => {
  return (
    <FluidContainer>
      <div className='flex justify-end pt-4'>
        <Link
          href='/'
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-[30px] ml-2'
          )}
        >
          Back
        </Link>
      </div>
      <SectionWrapper title='Update history'>
        {Object.entries(UPDATE_LIST).map((updateItem) => {
          const [key, updateInfo] = updateItem;
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
            : type === 'good'
            ? 'px-2 bg-orange-500'
            : 'px-2 bg-blue-500'
        }
      >
        {children}
      </div>
    </span>
  );
};

const UPDATE_LIST = {
  '6/19/24': {
    name: '6/19/24 update',
    updateContent: [
      {
        content: (
          <div>
            Resolve issues that combines the 'added sugar' and 'total sugar' to
            one nutrient item.
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Resolve issues that the protein's percent daily is recorded
            incorrectly
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Add new validator to 'added sugar' (Nutrition fact)
            <Tag type='test'>Testing</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Fix the response error on harmful content
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Remove 'sugar' from sugar and sweet claim
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Resolve issue that make UI crash when have not enough values for
            allergen validator and contain validator
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
    ],
  },
  '6/14/24': {
    name: '6/14/24 update',
    updateContent: [
      {
        content: (
          <div>
            Resolve issues does not show allergen on equipment statement
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Resolve issues that some type of tree nuts is not detected.
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Resolve crash issues when config detect nutrition/supplement fact
            only
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Test new strategy to detect, analyze, and validate "contain", "does
            not contain claim", "sweet and sugar", "non certifier" claims.
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>Fixing bug</Tag>
            <Tag type='imp'>Improving</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Apply new strategy to detect, analyze, and validate "fat",
            "calorie", "salt or sodium" claims to increase claim-detector
            precision.
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
            <Tag type='good'>Good result</Tag>
          </div>
        ),
      },
    ],
  },
  '6/10/24': {
    name: '6/10/24 update',
    updateContent: [
      {
        content: (
          <div>
            Apply new strategy to detect, analyze, and validate "contain", "does
            not contain claim", "sweet and sugar", "non certifier" claims to
            increase claim-detector precision.
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
            <Tag type='good'>Good result</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Resolve the issue that some preview image fail to display after
            inputting image files
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Resolve the issue that nutrition fact result is frequently produced
            in wrong format
            <Tag type='default'>Fixed</Tag>
          </div>
        ),
      },
    ],
  },
  '6/5/24': {
    name: '6/5/24 update',
    updateContent: [
      {
        content: (
          <div>
            Detect and map calories claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Detect and map grade claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Detect and map "high/rich/excellent" claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Detect and map calories claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Detect and map non-certifier claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Detect and map sugar claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Detect and map whole grain claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Detect and map whole fat claims
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Add some items to contain and does-not-contain claims (such as nut
            shell, rbgh/bst,)
            <Tag type='test'>Testing</Tag>
            <Tag type='default'>In-progress</Tag>
          </div>
        ),
      },
      {
        content: (
          <div>
            Test method using OCR text to validate input images for other data
            points
            <Tag type='test'>Testing</Tag>
            <Tag type='good'>Good result</Tag>
          </div>
        ),
      },
    ],
  },
  '6/3/24': {
    name: '6/3/24 update',
    updateContent: [
      {
        content: (
          <div>
            Map detected allergen (contain, free of, on equipment) to enum value
            <Tag type='test'>Testing</Tag>
            <Tag type='imp'>Improving</Tag>
          </div>
        ),
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
            Add OCR text to validate input images for other data points
            <Tag type='exp'>Experimental</Tag>
          </div>
        ),
      },
    ],
  },
  '5/29/24': {
    name: '5/29/24 update',
    updateContent: [
      {
        content: (
          <div>
            Get ancillary info from supplement dietary ingredients (that could
            be sub-ingredients, equivalent substance, extra info, ...)
            <Tag type='test'>Testing</Tag>
            <Tag type='imp'>Improving</Tag>
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
