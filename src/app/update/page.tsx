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
  '6/20/24': {
    name: '6/20/24 update',
    updateContent: [
      {
        content: (
          <div>
            <div className='font-bold'>PRECISION:</div>
            <div className='mt-2'>
              <div className='font-bold'>Allergen:</div>
              <div>
                + contain
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + free of
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + contain on equipment statement
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + contain on equipment list
                <Tag type='test'>high</Tag>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Ingredients:</div>
              <div>
                + ingredient statement
                <Tag type='test'>high</Tag>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Header:</div>
              <div>
                + primary size
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + primary size text
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + secondary size
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + secondary size text
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + unit count
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + product name
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + brand name
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + size text description
                <Tag type='test'>high</Tag>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Physical:</div>
              <div>
                + upc12
                <Tag type='good'>medium</Tag>
                <div className='text-muted-foreground'>
                  possible issue: missing first number
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Nutrition Fact:</div>
              <div>
                + Nutrient Name
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + quantity
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + uom
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + percent daily value
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + Footnote symbol
                <Tag type='good'>medium</Tag>
              </div>
              <div>
                + Footnote
                <Tag type='test'>high</Tag>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Supplement Fact:</div>
              <div>
                + Nutrient Name / dietary ingredient name
                <Tag type='test'>high</Tag>
                <div className='text-muted-foreground'>
                  possible issue: extracted name could be wrong
                </div>
              </div>
              <div>
                + quantity
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + uom
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + percent daily value
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + Footnote symbol
                <Tag type='good'>medium</Tag>
                <div className='text-muted-foreground'>
                  possible issue: sometimes footnote symbol could not be
                  detected or wrong footnote symbol
                </div>
              </div>
              <div>
                + descriptor
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + sub-ingredients of dietary ingredient
                <Tag type='good'>medium</Tag>
                <div className='text-muted-foreground'>
                  possible issue: sub-ingredients info could be incorrectly read
                  for too complicated supplement fact
                </div>
              </div>
              <div>
                + Footnote
                <Tag type='test'>high</Tag>
                <div className='text-muted-foreground'>
                  possible issue: wrong footnote symbol
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Attributes:</div>
              <div>
                + contain
                <Tag type='good'>high</Tag>
              </div>
              <div>
                + does not contain
                <Tag type='good'>high</Tag>
              </div>
              <div>
                + certifier
                <Tag type='default'>low</Tag>
                <div className='text-muted-foreground'>
                  possible issue: fake certifier symbol could be read as a legal
                  certifier logo
                </div>
                <div className='text-muted-foreground'>
                  possible issue: many certifier logos are missing from reading
                  result
                </div>
                <div className='text-muted-foreground'>
                  possible solution: train a certifier logo detector for better
                  result
                </div>
              </div>
              <div>
                + claim with certifier
                <Tag type='good'>medium</Tag>
              </div>
              <div>
                + grade claim
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + fat claim
                <Tag type='test'>high</Tag>
                <div className='text-muted-foreground'>
                  possible issue: some fat claim such as 'no fat' could be
                  implied for 'total fat 0g' in nutrition fact
                </div>
              </div>
              <div>
                + calorie claim
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + sugar and sweet claim
                <Tag type='test'>high</Tag>
                <div className='text-muted-foreground'>
                  possible issue: the sweet claim such as "corn syrup" could be
                  deduced from "high fructose corn syrup". The expected result
                  is only "high fructose corn syrup"
                  <Tag type='default'>fixing</Tag>
                </div>
              </div>
              <div>
                + non-certifier claim
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + acidity claim
                <Tag type='test'>very high</Tag>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Supply chain:</div>
              <div>
                + country of origin
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + manufacturer phone number
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + manufacturer address
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + manufacturer city
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + manufacturer state
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + manufacturer zipcode
                <Tag type='test'>very high</Tag>
              </div>
              <div>
                + manufacturer name
                <Tag type='test'>high</Tag>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Marketing:</div>
              <div>
                + social media
                <Tag type='test'>medium</Tag>
                <div className='text-muted-foreground'>
                  possible issue: sometimes pinterest logo could not be detected
                </div>
              </div>
              <div>
                + copyright/trademark
                <Tag type='good'>medium</Tag>
              </div>
              <div>
                + enlarged to show
                <Tag type='test'>high</Tag>
              </div>
              <div>
                + website
                <Tag type='test'>high</Tag>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Packaging:</div>
              <div>
                + Forest Stewardship Council Claim
                <Tag type='test'>high</Tag>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
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
