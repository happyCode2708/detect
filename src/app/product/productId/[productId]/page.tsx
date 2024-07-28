'use client';
import { useEffect, useState, useRef, MutableRefObject, useMemo } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
// import ExtractionHistory from '@/components/extract-history/ExtractionHitory';
import {
  useMutateGetCompareResultWithTdc,
  useMutateProductExtraction,
  useMutateRevalidateProductData,
  useMutateUploadFile,
  useQueryProductDetail,
} from '@/queries/home';
import { FluidContainer } from '@/components/container/FluidContainer';
import { Result } from '@/components/result/Result';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { PreviewImage } from '@/components/preview-image/PreviewImage';
import { ViewListImage } from '@/components/preview-image/ViewListImage';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isEqual } from 'lodash';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { SectionWrapper } from '@/components/wrapper/SectionWrapper';
import { useParams, useRouter } from 'next/navigation';
import {
  useMutateSaveCompareResult,
  useQueryProductsFromTdc,
} from '@/queries/productDetailQuery';
import { sleep } from '@/lib/utils/time';
import ProductImageUploadDialog from '@/components/product/ProductImageUploadDialog';
import { CamelFieldStringRender } from '@/components/result/common';
// import { compare } from 'bcryptjs';

const ProductDetailPage = () => {
  const params = useParams();

  const productId = params?.['productId'] as string;

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [productInfo, setProductInfo] = useState<any>(null);
  const [inputImages, setInputImages] = useState<any>([]);
  const [procImages, setProcImages] = useState<any>([]);
  const [biasForm, setBiasForm] = useState<any>({});
  const [outputConfig, setOutputConfig] = useState<any>({
    nut: true,
    other: true,
  });

  const [productIxone, setProductIxone] = useState<any>(null);
  const [sessionId, setSessionId] = useState<any>();
  const [pdSessionId, setPdSessionId] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<null | string>(null);

  const refInterval = useRef<number | null>(null);

  const queryClient = useQueryClient();

  const mutationProductExtract = useMutateProductExtraction();
  const mutationRevalidateProductData = useMutateRevalidateProductData();
  const mutateGetCompareResultWithTdc = useMutateGetCompareResultWithTdc();
  const mutateSaveCompareResult = useMutateSaveCompareResult();

  const router = useRouter();

  const { data: compareResultResponse } = mutateGetCompareResultWithTdc;
  const compareResultData = compareResultResponse?.data;

  const { data: productIxoneRes, isLoading: loadingProductDetail } =
    useQueryProductDetail({ productId });

  const productData = productIxoneRes?.data;

  const { product: productDetail } = productData || {};

  const { ixoneID: ixoneid, upc12 } = productDetail || {};

  const { data: tdcData } = useQueryProductsFromTdc(
    {
      ixoneIDs: typeof ixoneid === 'string' ? [ixoneid] : [],
    },
    {
      enabled: !!ixoneid,
    }
  );

  const { toast } = useToast();

  const imageUrls = productIxone?.images?.map((item: any) => item?.url);

  const isCompareSaved = useMemo(() => {
    return (
      productIxone?.compareResult &&
      productIxone?.compareResult ===
        JSON.stringify(compareResultData?.compareResult)
    );
  }, [JSON.stringify(productIxone), JSON.stringify(compareResultData)]);

  useEffect(() => {
    if (!productIxoneRes) return;

    const productData = productIxoneRes?.data;

    const { product: productInfo, latestSession } = productData;

    if (!productInfo) return;

    setProductIxone(productInfo);

    if (latestSession?.result) {
      setProductInfo(JSON.parse(latestSession?.result));
      setPdSessionId(latestSession?.sessionId);
    }
  }, [JSON.stringify(productIxoneRes)]);

  useEffect(() => {
    if (pdSessionId || sessionId) {
      mutateGetCompareResultWithTdc.mutate({ ixoneid, productId });
    }
  }, [pdSessionId, ixoneid, sessionId, productId]);

  const handleSubmitImageUrl = async () => {
    const formData = new FormData();

    formData.append('imageUrls', JSON.stringify(imageUrls));

    formData.append('biasForm', JSON.stringify(biasForm));
    formData.append('outputConfig', JSON.stringify(outputConfig));

    const payload = {
      biasForm: JSON.stringify(biasForm),
      outputConfig: JSON.stringify(outputConfig),
      productId,
    };

    setLoading(true);
    setProductInfo(null);

    mutationProductExtract.mutate(payload, {
      onError: (e) => {
        console.log(e);
        setLoading(false);
      },
      onSuccess: (res) => {
        const { sessionId, images, messages } = res;
        if (images?.length > 0) {
          setProcImages(images);
        }

        if (
          messages?.length > 0 &&
          !!messages.find((item: string | null) => item !== null)
        ) {
          // toast({
          //   title: 'Info',
          //   description: (
          //     <div>
          //       {messages?.map((messageItem: string | null) => {
          //         if (messageItem) {
          //           return <div className='mb-2'>{messageItem} </div>;
          //         }
          //         return null;
          //       })}
          //     </div>
          //   ),
          //   variant: 'destructive',
          //   duration: 7000,
          // });
        }
        setSessionId(sessionId);
        // queryClient.invalidateQueries({ queryKey: ['history'] });
      },
    });
  };

  const handleRevalidateProductData = async () => {
    setSessionId(null);
    const payload = {
      ixoneId: ixoneid,
    };

    setLoading(true);
    setProductInfo(null);
    setSessionId(null);
    await sleep(1000);

    mutationRevalidateProductData.mutate(payload, {
      onError: (e) => {
        console.log(e);
        setLoading(false);
      },
      onSuccess: (res) => {
        const { data, messages } = res;
        const { sessionId } = data;

        setSessionId(sessionId);
        setLoading(false);
        // queryClient.invalidateQueries({ queryKey: ['history'] });
      },
    });
  };

  const handleSaveCompareResult = async () => {
    const payload = {
      ixoneid: ixoneid as string,
      compareResult: compareResultData?.compareResult || '',
    };

    setLoading(true);

    mutateSaveCompareResult.mutate(payload, {
      onError: (e) => {
        setLoading(false);
      },
      onSuccess: (res) => {
        const { message } = res;
        toast({
          title: 'Info',
          description: message,
          variant: 'success',
          duration: 2000,
        });
        setLoading(false);
        queryClient.invalidateQueries({
          queryKey: ['product', 'ixoneid', `${ixoneid}`],
        });
      },
    });
  };

  const onCancel = () => {
    setLoading(false);
    setSessionId('');
    setProductInfo(null);
    if (refInterval.current) {
      window.clearInterval(refInterval.current);
    }
  };

  const onSelectBias = (imgIdx: number, updateFormState: any) => {
    setBiasForm((prev: any) => {
      let newBiasForm = { ...prev };

      newBiasForm = {
        ...newBiasForm,
        [imgIdx]: {
          ...(newBiasForm?.[imgIdx] || {}),
          ...updateFormState,
        },
      };

      return newBiasForm;
    });
  };

  useEffect(() => {
    if (sessionId) {
      refInterval.current = window.setInterval(async () => {
        try {
          const response = await fetch('/api/info/pooling-result/' + sessionId);
          if (!response.ok) {
            throw new Error(
              'Network response was not ok ' + response.statusText
            );
          }
          const res = await response.json();

          const { isSuccess, data, message } = res || {};

          if (isSuccess === false) {
            setLoading(false);
            toast({
              title: 'Something went wrong',
              description: message,
              variant: 'destructive',
              duration: 7000,
            });
            if (refInterval.current) {
              clearInterval(refInterval.current);
            }
            return;
          }

          if (isSuccess === true) {
            setProductInfo(data);
            toast({
              title: 'Successfully',
              description: message,
              variant: 'success',
              duration: 5000,
            });

            if (refInterval.current) {
              clearInterval(refInterval.current);
            }

            mutateGetCompareResultWithTdc.mutate({ ixoneid, productId });

            queryClient.invalidateQueries({ queryKey: ['product', 'id'] });
            setLoading(false);
          }
        } catch (error) {
          console.error('some thing went wrong', error);
          if (refInterval.current) {
            clearInterval(refInterval.current);
          }
          setLoading(false);
        }
      }, 6000);
    }
    return () => {
      if (!refInterval.current) return;

      window.clearInterval(refInterval.current);
    };
  }, [sessionId]);

  if (loadingProductDetail) {
    return <div>Loading...</div>;
  }

  return (
    <FluidContainer>
      <div className='flex flex-col gap-4 py-4 px-4'>
        <div className='gap-2'>
          <div>
            <div className='flex justify-end'>
              <Button variant={'outline'} onClick={() => router.back()}>
                Close
              </Button>
            </div>
            <SectionWrapper title='Output Config'>
              <div className='flex flex-row gap-4'>
                <div className='flex flex-row gap-2'>
                  <Label className='col-span-3'>
                    Nutrition/Supplement Facts
                  </Label>
                  <Checkbox
                    checked={outputConfig?.nut}
                    onCheckedChange={(checked: boolean) => {
                      setOutputConfig((prev: any) => ({
                        ...prev,
                        nut: checked,
                      }));
                    }}
                    disabled
                  />
                </div>
                <div className='flex flex-row gap-2'>
                  <Label className='col-span-3'>Others </Label>
                  <Checkbox
                    checked={outputConfig?.other}
                    onCheckedChange={(checked: boolean) => {
                      setOutputConfig((prev: any) => ({
                        ...prev,
                        other: checked,
                      }));
                    }}
                    disabled
                  />
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
        <SectionWrapper
          title={
            'Input Images' +
            (productIxone?.ixoneID ? ' - ' + productIxone?.ixoneID : '')
          }
        >
          <div className='flex flex-wrap align-middle'>
            {productIxone?.images?.map((imageItem: any) => {
              return (
                <div
                  className='w-[80px] max-h-[80px] flex justify-center align-middle p-2 cursor-pointer rounded-sm hover:border'
                  key={imageItem?.url}
                  onClick={() => setPreviewImage(imageItem?.url)}
                >
                  <img className='object-fit' src={imageItem?.url}></img>
                </div>
              );
            })}
          </div>
        </SectionWrapper>
        <div className='block'>
          <SectionWrapper title='Tool'>
            <div className='flex flex-row gap-2 flex-1'>
              <Button
                disabled={loading || imageUrls?.length <= 0}
                onClick={handleSubmitImageUrl}
              >
                {loading ? (
                  <div className='flex flex-row items-center'>
                    <RefreshCcw className='mr-1 animate-spin' />
                    <span>Processing</span>
                  </div>
                ) : (
                  'Extract'
                )}
              </Button>
              {process.env.NODE_ENV !== 'production' && (
                <>
                  <Button
                    disabled={loading || imageUrls?.length <= 0}
                    onClick={handleRevalidateProductData}
                  >
                    {loading ? (
                      <div className='flex flex-row items-center'>
                        <RefreshCcw className='mr-1 animate-spin' />
                        <span>Processing</span>
                      </div>
                    ) : (
                      'Revalidate'
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveCompareResult}
                    disabled={!compareResultData || isCompareSaved || loading}
                  >
                    {loading ? (
                      <div className='flex flex-row items-center'>
                        <RefreshCcw className='mr-1 animate-spin' />
                        <span>Processing</span>
                      </div>
                    ) : (
                      'Save Compare Result'
                    )}
                  </Button>
                </>
              )}
              <ProductImageUploadDialog
                isOpen={uploadDialogOpen}
                toggleDialog={() => {
                  setUploadDialogOpen(!uploadDialogOpen);
                }}
                // ixoneID={product?.ixoneID}
                product={{ id: productId }}
                disable={loading}
              ></ProductImageUploadDialog>
              {loading && (
                <Button variant='secondary' onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </SectionWrapper>
        </div>
        {(upc12 || ixoneid) && (
          <SectionWrapper title={'Product Identification'}>
            <CamelFieldStringRender
              objectValues={{
                ixoneid,
                upc12,
              }}
            />
          </SectionWrapper>
        )}

        <div className='flex flex-row'>
          <div>
            {inputImages?.length > 0 && (
              <SectionWrapper title='Input Images'>
                <ViewListImage
                  images={inputImages}
                  onSelectBias={onSelectBias}
                  biasForm={biasForm}
                />
              </SectionWrapper>
            )}
            {procImages?.length > 0 && (
              <SectionWrapper title='Processed Images'>
                <ViewListImage
                  images={procImages}
                  onSelectBias={onSelectBias}
                  biasForm={biasForm}
                />
              </SectionWrapper>
            )}
            {!isEqual(biasForm, {}) && (
              <SectionWrapper title='Bias Configuration'>
                {Object.entries(biasForm).map(
                  (biasImage: [key: string, value: any], idx: number) => {
                    const [key, value] = biasImage;

                    const isShow = value?.haveNutFact === true;

                    if (isShow === false) return null;

                    return (
                      <div className='flex flex-row mb-2' key={idx}>
                        <div className='w-[100px] h-[100px] border rounded-sm p-2 flex items-center justify-center relative'>
                          <img
                            src={inputImages[key]}
                            className='max-w-full max-h-full object-contain object-center'
                          />
                        </div>
                        <div className='p-2'>
                          {value?.haveNutFact === true && (
                            <div className='space-x-2 flex flex-row align-middle'>
                              <Checkbox checked={true}></Checkbox>
                              <Label>Nut/Supple Facts</Label>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </SectionWrapper>
            )}
          </div>

          {productInfo && (
            <div className='flex-1 overflow-hidden'>
              <SectionWrapper title={'Result - ' + (sessionId || pdSessionId)}>
                <Result
                  productInfo={productInfo}
                  productTdcData={tdcData?.data?.Products?.[0]}
                  compareResultData={compareResultData}
                />
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
        {/* <div className='whitespace-pre-line max-h-[500px] overflow-auto'>
          {
            'INFO FORMAT:\nCOOKING_INSTRUCTION_OBJECT\n[\n{\n  "recipes": [{\n    "recipe name": "Classic Chocolate Chip Cookies",\n    "recipe ingredient list": [\n      "2 1/4 cups All - Purpose Flour Artisan Blend",\n      "3/4 tsp baking soda",\n      "1 tsp salt",\n      "16 TBSP butter",\n      "1/2 cup white sugar",\n      "1 cup packed light brown sugar",\n      "1 tsp vanilla",\n      "2 eggs, large",\n      "2 cups semi - sweet chocolate chips",\n      "Optional: 1 cup chopped walnuts"\n    ],\n    "cooking steps": [\n      "Preheat oven to 350 ° .",\n      "Grease baking sheets or line with parchment paper.",\n      "In a large bowl cream the butter, white and brown sugar, and vanilla until smooth.",\n      "Beat in eggs.",\n      "Gradually add flour, baking soda and salt, stirring until well mixed.",\n      "Fold in chocolate chips and nuts, if using.",\n      "Drop dough by the tablespoon onto prepared baking sheets, spacing them about 2 inches apart.",\n      "Bake for 12 to 15 minutes or until edges start to brown"\n    ],\n  },\n  {\n    "recipe name": "Banana Nut Bread",\n    "recipe ingredient list": [\n      "2 cups All - Purpose Flour Artisan Blend",\n      "8 TBSP butter",\n      "1 cup sugar",\n      "1/2 cup packed brown sugar",\n      "2 eggs, large",\n      "1 tsp vanilla",\n      "1 cup mashed ripe banana ( about 4 medium bananas )",\n      "½ cup sour cream or plain Greek Yogurt",\n      "2 tsp baking powder",\n      "1 tsp salt",\n      "1 cup walnuts, chopped",\n      "Optional: 1/4 tsp nutmeg"\n    ],\n    "cooking steps": [\n      "Preheat oven to 350 ° .",\n      "Grease a 9 \\" x 5 \\" loaf pan.",\n      "Beat butter and sugar together until creamy, then mix in eggs and vanilla.",\n      "In a separate bowl, mix together bananas and sour cream or yogurt, and then add it to butter mixture.",\n      "Add dry ingredients and nuts and mix completely.",\n      "Pour into loaf pan.",\n      "Bake for 60 to 70 minutes, or until toothpick comes out clean."\n    ],\n  },\n  {\n    "recipe name": "Pie Crust",\n    "recipe ingredient list": [\n      "2½ cups All - Purpose Flour Artisan Blend",\n      "1 tsp salt",\n      "Optional: 1 tsp sugar",\n      "8 TBSP shortening, well chilled",\n      "8 TBSP unsalted butter, well chilled",\n      "½ cup ice water"\n    ],\n    "cooking steps": [\n      "Preheat oven to 425 ° .",\n      "Grease two 8 \\" pie pans.",\n      "Combine dry ingredients in a bowl, or in the bowl of a stand mixer, if using.",\n      "Using a pastry blender, fingers, or the paddle attachment of the mixer cut cold butter and shortening into dry mixture until pea sized crumbs are formed.",\n      "Add ice water and mix until dough can hold together in a ball.",\n      "If needed, use up to 1 TBSP additional water",\n      "Divide dough into two balls.",\n      "Working with one ball at a time, roll out dough between two pieces of plastic wrap to form a 10 \\" circle.",\n      "Remove wrap and gently press dough into pie pan.",\n      "For prebaked shell: bake for 15 minutes at 425 ° , then turn down oven to 375 ° and continue baking for 10 to 15 minutes or until brown.",\n      "Use prebaked or unbaked crust according to individual pie recipe."\n    ],\n  }],\n  "all other text or paragraph about cooking info": [\n    "For dairy - free , use 16 TBSP very cold butter alternative.",\n    "For egg - free , use equivalent prepared egg replacer."\n  ]\n}\n]\nEND__COOKING__INSTRUCTION__OBJECT\n\nSTORAGE_INSTRUCTION\n{\n  "storage instructions": [\n    "reseal for freshness"\n  ]\n}\nEND__STORAGE__INSTRUCTION\n\nUSAGE_INSTRUCTION\n{\n  "usage instructions": [\n    "Whisk 2 TBSP All - Purpose Flour Artisan Blend into 1 cup hot liquid to thicken gravies, sauces or soups.",\n    "Al - Purpose Flour Artisan Blend can be used for simple dredging or coating of meat or poultry."\n  ]\n}\nEND__USAGE__INSTRUCTION\n\nINFORMATION_INSTRUCTION\n{\n  "information instructions": [\n    "See nutrition info for saturated fat"\n  ]\n}\nEND__INFORMATION__INSTRUCTION\n\nLABELING_INFO_TABLE\n| label item type on product (answer is "certification label"/ "label text"/ "other") (if type "other" tell me what type you think it belong to) | what label item say ? |\n| ------- | -------- |\n| certification label | Gluten Free |\n| certification label | Certified Gluten Free |\n| certification label | Non GMO Project Verified |\n| certification label | Whole Grain |\n| label text | Gluten Free |\n| label text | 10g Whole Grains per serving |\n| label text | Artisan blend + Vegan |\n| label text | 1 to 1 Wheat Flour Replacement |\nEND__LABELING__INFO__TABLE\n\nLABELING_INFO_ANALYSIS_TABLE\n| label item | do label indicate product does not contain something? (answer is yes/no) | what are exactly things that product say not contain from the label item (split things by "/" for multiple if needed) |\n| ------- | -------- | -------- |\n| Gluten Free | yes | gluten |\n| Certified Gluten Free | yes | gluten |\n| Non GMO Project Verified | yes | GMO |\n| Whole Grain | no |  |\n| Gluten Free | yes | gluten |\n| 10g Whole Grains per serving | no |  |\n| Artisan blend + Vegan | no |  |\n| 1 to 1 Wheat Flour Replacement | no |  |\nEND__LABELING__INFO_ANALYSIS_TABLE\n\nALLERGEN_TABLE\n| allergen info | value 1 | value 2 | value 3 | ... (more columns if needed)\n| ------- | -------- | -------- | -------- | ...\n| allergen contain statement |  |  |  |  |\n| allergens contain statement break-down list (split by "/") |  |  |  |  |\n| allergens on equipments statement | Our products are produced on equipment that processes Tree Nuts, Coconut, Eggs, Soy, and Milk. |  |  |  |\n| allergens on equipments statement break-down list (split by "/") | Tree Nuts/Coconut/Eggs/Soy/Milk |  |  |  |\n| exact text on images about allergens that product does not contain | Gluten Free |  |  |  |\n| allergens product does not contain break-down list (split by "/") | gluten |  |  |  |\nEND__ALLERGEN__TABLE\n\nHEADER_TABLE\n| product name | brand name | primary size | secondary size | third size | full size statement | count | count uom |\n| ------- | -------- | -------- | ------- | -------- | -------- | -------- | -------- |\n| All - Purpose Flour Mix | Pamela\'s | 4 LB | 1.81 kg |  | NET WT 4 LB ( 1.81kg ) |  |  |\nEND__HEADER__TABLE\n\nBASE_CERTIFIER_CLAIM_TABLE\n| claim | is product claim that ? (answer is yes/no/unknown) |\n| ------- | -------- |\n| bee friendly claim | unknown |\n| bio-based claim | unknown |\n| biodynamic claim | unknown |\n| bioengineered claim | no |\n| cbd cannabidiol / help claim | unknown |\n| carbon footprint claim | unknown |\n| certified b corporation | unknown |\n| certified by international packaged ice association | unknown |\n| cold pressure verified | unknown |\n| cold pressure protected claim | unknown |\n| cradle to cradle claim | unknown |\n| cruelty free claim | unknown |\n| diabetic friendly claim | unknown |\n| eco fishery claim | unknown |\n| fair trade claim | unknown |\n| for life claim | unknown |\n| use GMO claim | no |\n| gmp claim | unknown |\n| gluten-free claim | yes |\n| glycemic index claim | unknown |\n| glyphosate residue free claim | unknown |\n| grass-fed claim | unknown |\n| halal claim | unknown |\n| hearth healthy claim | unknown |\n| Keto/Ketogenic Claim | unknown |\n| Kosher Claim | unknown |\n| Live and Active Culture Claim | unknown |\n| Low Glycemic Claim | unknown |\n| New York State Grown & Certified Claim | unknown |\n| Non-GMO Claim | yes |\n| Organic Claim | unknown |\n| PACA Claim | unknown |\n| PASA Claim | unknown |\n| Paleo Claim | unknown |\n| Plant Based/Derived Claim | unknown |\n| Rain Forest Alliance Claim | unknown |\n| Vegan Claim | yes |\n| Vegetarian Claim | yes |\n| Viticulture Claim | unknown |\n| Whole Grain Claim | yes |\nEND__BASE__CERTIFIER__CLAIM__TABLE'
          }
        </div> */}
      </div>

      <PreviewImage
        visible={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        src={previewImage}
        size={[1000, 1000]}
      />
    </FluidContainer>
  );
};

export default ProductDetailPage;
