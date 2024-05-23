'use client';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExtractionHistory from '@/components/extract-history/ExtractionHitory';
import { useMutateUploadFile } from '@/queries/home';
import { FluidContainer } from '@/components/container/FluidContainer';
import { Result } from '@/components/result/Result';
import { useQueryClient } from '@tanstack/react-query';
import { PreviewImage } from '@/components/preview-image/PreviewImage';
import { ViewListImage } from '@/components/preview-image/ViewListImage';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Home() {
  const [files, setFiles] = useState<any>([]);
  const [productInfo, setProductInfo] = useState(null);
  const [inputImages, setInputImages] = useState<any>([]);
  const [procImages, setProcImages] = useState<any>([]);

  const [resultFileName, setResultFileName] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<null | string>(null);

  const refInput = useRef() as React.RefObject<HTMLInputElement>;
  const refInterval = useRef<number | null>(null);

  const mutationUploadFile = useMutateUploadFile();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!files.length) return;

    const formData = new FormData();

    files.forEach((file: any) => {
      formData.append('file', file);
    });

    setLoading(true);
    setProductInfo(null);

    mutationUploadFile.mutate(formData, {
      onError: (e) => {
        console.log(e);
      },
      onSuccess: (res) => {
        const { resultFileName, images } = res;
        if (images?.length > 0) {
          setProcImages(images);
        }
        setResultFileName(resultFileName);
        queryClient.invalidateQueries({ queryKey: ['history'] });
      },
    });
  };

  const onCancel = () => {
    setLoading(false);
    setResultFileName('');
    setProductInfo(null);
    if (refInterval.current) {
      window.clearInterval(refInterval.current);
    }
  };

  const onClearFile = () => {
    setFiles([]);
    setInputImages([]);
    setProcImages([]);
    if (!refInput.current) return;
    refInput.current.value = '';
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    setFiles(files);
    const fileReaders = [];
    let fileDataUrls: any = [];

    if (files.length === 0) return;

    files.forEach((file) => {
      const fileReader = new FileReader();

      fileReaders.push(fileReader);

      fileReader.onload = (e) => {
        if (!e?.target) return;

        fileDataUrls.push(e.target.result);

        // Only update state when all files are read
        if (fileDataUrls.length === files.length) {
          setInputImages(fileDataUrls);
        }
      };

      fileReader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (resultFileName) {
      refInterval.current = window.setInterval(async () => {
        try {
          const response = await fetch(
            '/api/fact/get-result/' + resultFileName
          );
          if (!response.ok) {
            throw new Error(
              'Network response was not ok ' + response.statusText
            );
          }
          const data = await response.json();

          const result = data;

          const { isSuccess } = result || {};

          if (isSuccess === false) {
            setLoading(false);
            toast({
              title: 'Something went wrong',
              description: 'Failed to process. Please try again',
              variant: 'destructive',
              duration: 7000,
            });
            if (refInterval.current) {
              clearInterval(refInterval.current);
            }
            return;
          }

          setProductInfo(result);

          toast({
            title: 'Successfully',
            description: 'Images processing is complete',
            variant: 'success',
            duration: 5000,
          });

          if (refInterval.current) {
            clearInterval(refInterval.current);
          }

          setLoading(false);
        } catch (error) {
          console.error('Waiting for result', error);
        }
      }, 4500);
    }
    return () => {
      if (!refInterval.current) return;

      window.clearInterval(refInterval.current);
    };
  }, [resultFileName]);

  return (
    <FluidContainer>
      <div className='flex flex-col gap-10 p-10'>
        <div className='flex flex-row items-center w-full gap-2'>
          <div className='rounded-md p-4 border flex flex-row gap-2 flex-1'>
            <Input
              ref={refInput}
              type='file'
              onChange={handleSelectFile}
              required
              multiple
            />
            <Button variant='destructive' onClick={onClearFile}>
              Clear
            </Button>
          </div>
          <Button
            disabled={loading || files?.length <= 0}
            onClick={handleSubmit}
          >
            {loading ? (
              <div className='flex flex-row items-center'>
                <RefreshCcw className='mr-1 animate-spin' />
                <span>Proccessing</span>
              </div>
            ) : (
              'Extract'
            )}
          </Button>
          {loading && (
            <Button variant='secondary' onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        {/* <ExtractionHistory /> */}

        <div className='flex flex-row gap-4'>
          <div>
            {inputImages?.length > 0 && (
              <SectionWrapper title='Input Images'>
                <ViewListImage images={inputImages} />
              </SectionWrapper>
            )}
            {procImages?.length > 0 && (
              <SectionWrapper title='Processed Images'>
                <ViewListImage images={procImages} />
              </SectionWrapper>
            )}
          </div>

          {productInfo && (
            <div className='flex-1 overflow-hidden'>
              <SectionWrapper title='Result'>
                <Result productInfo={productInfo} />
              </SectionWrapper>
            </div>
          )}
          {loading && (
            <div className='flex-1 overflow-hidden pt-6'>
              <Alert>
                <Loader className='h-4 w-4' />
                <AlertTitle>Processing!</AlertTitle>
                <AlertDescription>
                  Your images are currently being processed in a background
                  task. You will be notified once the processing is complete.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
      <PreviewImage
        visible={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        src={previewImage}
        size={[1000, 1000]}
      />
    </FluidContainer>
  );
}

const SectionWrapper = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className='pt-6 relative'>
      <div className='border rounded-md p-[10px] pt-[20px]'>
        {title && (
          <div className='font-bold border rounded-lg px-[8px] py-[2px] absolute top-[8px] lef-[35px] bg-white'>
            {title}
          </div>
        )}
        {children && children}
      </div>
    </div>
  );
};

const test = {
  answerOfQuestionsAboutNutritionFact:
    'No, I do not see the whole nutrition fact panel on the provided image. The image provided does not show the entire panel, making it difficult to gather all the necessary details.',
  answerOfQuestionAboutNutritionFactTitle:
    "No, I do not see a fully visible 'Supplement Fact' or 'Nutrition Fact' title on the provided image.",
  answerOfQuestion:
    'I will only provide information that is visibly seen on the provided image. I will not include information that is not observable.',
  answerOfRemindQuestion:
    'I will only provide information in English and will exclude any information in Spanish or other languages.',
  answerOfusingEnum:
    'I will ensure that the values added to the fields are from the provided enums. If a value is not from the enum, it will be considered invalid and will not be added.',
  product: {
    certifierAndLogo: 'kosher U pareve, USDA organic',
    readAllConstants:
      'Yes, I have read all the constants carefully and will use them to create the JSON output.',
    factPanels: [
      {
        panelName: 'Nutrition Facts',
        amountPerServing: { name: 'Amount per serving' },
        calories: { value: 100, uom: 'calories' },
        servingSize: { description: 'Serving Size', value: '1', uom: 'cup' },
        servingPerContainer: { value: 4, uom: 'servings' },
        nutrients: [
          {
            name: 'Total Fat',
            descriptor: null,
            quantityComparisonOperator: null,
            value: 0.5,
            uom: 'g',
            quantityDescription: null,
            dailyPercentComparisonOperator: null,
            percentDailyValue: 1,
            footnoteIndicator: null,
          },
          {
            name: 'Sodium',
            descriptor: null,
            quantityComparisonOperator: null,
            value: 10,
            uom: 'mg',
            quantityDescription: null,
            dailyPercentComparisonOperator: null,
            percentDailyValue: 0,
            footnoteIndicator: null,
          },
          {
            name: 'Total Carbohydrate',
            descriptor: null,
            quantityComparisonOperator: null,
            value: 22,
            uom: 'g',
            quantityDescription: null,
            dailyPercentComparisonOperator: null,
            percentDailyValue: 8,
            footnoteIndicator: null,
          },
          {
            name: 'Protein',
            descriptor: null,
            quantityComparisonOperator: null,
            value: 2,
            uom: 'g',
            quantityDescription: null,
            dailyPercentComparisonOperator: null,
            percentDailyValue: 4,
            footnoteIndicator: null,
          },
        ],
        footnote: {
          value: '* Percent Daily Values are based on a 2,000 calorie diet.',
        },
      },
    ],
    ingredientsGroup: [
      {
        ingredients: [
          'whole grain oats',
          'sugar',
          'corn starch',
          'salt',
          'tripotassium phosphate',
          'wheat starch',
          'vitamin E',
        ],
      },
    ],
    allergen: {
      contain: ['oats', 'wheat'],
      containOnEquipment: {
        statement: 'Processed in a facility that also processes peanuts.',
        allergenList: ['peanuts'],
      },
      freeOf: [
        'crustacean shellfish',
        'dairy',
        'egg',
        'fish',
        'milk',
        'peanuts / peanut oil',
        'phenylalanine',
        'sesame',
        'soy / soybeans',
        'tree nuts',
      ],
    },
    header: {
      productName: 'Oat Cereal',
      brandName: 'Healthy Brand',
      primarySize: {
        primarySizeValue: '12',
        primarySizeUom: 'oz',
        primarySizeText: '12 oz',
      },
      secondarySize: {
        secondarySizeValue: '340',
        secondarySizeUom: 'g',
        secondarySizeText: '340g',
      },
      thirdSize: {
        thirdSizeValue: null,
        thirdSizeUom: null,
        thirdSizeText: null,
      },
      sizeTextDescription: 'Net Wt. 12 oz (340g)',
      count: 1,
    },
    packaging: {
      containerMaterialType: 'cardboard',
      containerType: 'box',
      recyclingAdvice: ['recyclable'],
      forestStewardshipCouncilClaim: false,
      packaging_ancillaryInformation: [],
    },
    attributesAndCertifiers: {
      claims: {
        beeFriendly: {
          beeFriendly_Certifier: null,
          beeFriendly_claim: false,
        },
        bioBased: {
          bioBased_certifier: null,
          bioBased_claim: false,
        },
        bioDynamic: {
          bioDynamic_certifier: null,
          bioDynamic_claim: false,
        },
        gmp: {
          gmp_certifier: null,
          gmp_claim: false,
        },
        glutenFree: {
          glutenFree_certifier: null,
          glutenFree_claim: false,
        },
        italCertifiedSeal: {
          italCertifiedSeal_certifier: null,
          italCertifiedSeal_claim: false,
        },
        italCertifiedConsious: {
          italCertifiedConsious_certifier: null,
          italCertifiedConsious_claim: false,
        },
        kosher: {
          kosher_certifier: 'Kosher U',
          kosher_claim: true,
        },
        liveAndActiveCulture: {
          liveAndActiveCulture_certifier: null,
          liveAndActiveCulture_claim: false,
        },
        lowGlycemic: {
          lowGlycemic_certifier: null,
          lowGlycemic_claim: false,
        },
        npa: {
          npa_certifier: null,
          npa_claim: false,
        },
        newYorkStateGrownAndCertified: {
          newYorkStateGrownAndCertified_certifier: null,
          newYorkStateGrownAndCertified_claim: false,
        },
        nonGmo: {
          nonGmo_certifier: null,
          nonGmo_claim: false,
        },
        organic: {
          organic_Certifier: 'USDA',
          organic_claim: true,
        },
        glyphosateResidueFree: {
          glyphosateResidueFree_certifier: null,
          glyphosateResidueFree_claim: false,
        },
        vegan: {
          vegan_certifier: null,
          vegan_claim: false,
        },
        plantBasedOrPlantDerived: {
          plantBasedOrPlantDerived_certifier: null,
          plantBasedOrPlantDerived_claim: false,
        },
      },
      containInfo: {
        attribute_contain: ['natural ingredients', 'whole grain oats'],
        attribute_doesNotContain: ['artificial colors', 'artificial flavors'],
      },
      otherClaims: {
        fatContentClaims: ['low fat'],
        saltOrSodiumClaims: ['low sodium'],
        sugarAndSweetenerClaims: ['no added sugar'],
        highOrRichInOrExcellentSourceOf: ['rich in fiber'],
        usdaInspectionMark: 'USDA organic',
      },
    },
    physical: {
      upc12: '123456789012',
    },
    marketingAll: {
      marketingContents: [
        'Made with whole grain oats',
        'Good source of fiber',
        'No artificial colors or flavors',
      ],
      copyrightOrTradeMark: '© 2024 Healthy Brand',
      slogan: 'Healthy and Delicious',
      website: 'www.healthybrand.com',
      socialMedia: {
        socialList: ['facebook', 'twitter', 'instagram'],
        socialMediaText: ['@healthybrand'],
      },
      enlaredToShow: false,
    },
    supplyChain: {
      CountryOfOrigin: 'USA',
      manufactureDate: '2024-01-01',
      manufacturePhoneNumber: '1234567890',
      manufactureStreetAddress: '123 Healthy Way',
      manufactureCity: 'Healthville',
      manufactureState: 'CA',
      manufactureZipcode: '12345',
      manufactureName: 'Healthy Brand Inc.',
    },
    instructions: {
      consumerStorageInstructions: ['Store in a cool, dry place'],
      otherInstruction: ['Do not freeze'],
      cookingInstructions: ['Add milk and enjoy'],
      usageInstructions: ['Perfect for breakfast'],
    },
  },
};
