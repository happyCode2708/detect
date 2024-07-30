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
            'COOKING_INSTRUCTION_OBJECT\n[\n{\n  "recipes": [],\n  "all other text or paragraph about cooking info": []\n}\n]\nEND_COOKING_INSTRUCTION_OBJECT\n\nSTORAGE_INSTRUCTION\n{\n  "storage instructions": [\n    "KEEP REFRIGERATED"\n  ]\n}\nEND_STORAGE_INSTRUCTION\n\nUSAGE_INSTRUCTION\n{\n  "usage instructions": []\n}\nEND_USAGE_INSTRUCTION\n\nINFORMATION_INSTRUCTION\n{\n  "information instructions": [\n    "The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice."\n  ]\n}\nEND_INFORMATION_INSTRUCTION\n\nLABELING_INFO_TABLE\n| label item type on product (answer is "certification label"/ "label text"/ "other") (if type "other" tell me what type you think it belong to) | what label item say ? |\n| ------- | -------- |\n| label text | ALL TASTE NO TANG® |\n| label text | PROBIOTIC |\n| label text | NO ARTIFICIAL FLAVORS |\n| label text | ALL TASTE NO TANG® |\n| certification label | Ⓤ |\n| label text | GRADE A |\n| label text | FROM COWS NOT TREATED WITH rBST |\n| label text | NO SIGNIFICANT DIFFERENCE HAS BEEN SHOWN BETWEEN MILK DERIVED FROM rBST TREATED AND NON - BST TREATED COWS . |\nEND_LABELING_INFO_TABLE\n\nLABELING_INFO_ANALYSIS_TABLE\n| label item | do label indicate product does not contain something? (answer is yes/no) | what are exactly things that product say not contain from the label item (split things by "/" for multiple if needed) |\n| ------- | -------- | -------- |\n| ALL TASTE NO TANG® | yes | tang |\n| PROBIOTIC | no |  |\n| NO ARTIFICIAL FLAVORS | yes | artificial flavors |\n| ALL TASTE NO TANG® | yes | tang |\n| Ⓤ | no |  |\n| GRADE A | no |  |\n| FROM COWS NOT TREATED WITH rBST | yes | rBST |\n| NO SIGNIFICANT DIFFERENCE HAS BEEN SHOWN BETWEEN MILK DERIVED FROM rBST TREATED AND NON - BST TREATED COWS . | yes | rBST |\nEND_LABELING_INFO_ANALYSIS_TABLE\n\nALLERGEN_OBJECT\n{\n  "allergens contain": \n  {\n    "all statements about allergens product contain": [\n      "CONTAINS : MILK"\n    ],\n    "allergens contain statement break-down list": [\n      "milk"\n    ]\n  },\n  "allergens on equipments or in facility":\n  {\n    "all statements about allergens on manufacturing equipments or from facility": [],\n    "allergens list from manufacturing equipments or from facility": [],\n    "allergens list not present in facility": []\n  },\n  "allergens product info state not contain": \n  {\n    "exact all texts or statements on images about allergens that product does not contain": [\n      "NO ARTIFICIAL FLAVORS"\n    ],\n    "allergens product does not contain break-down list": [\n      "artificial flavors"\n    ]\n  }\n}\nEND_ALLERGEN_OBJECT\n\nHEADER_OBJECT\n{\n  "product info": {\n    "product name": "HONEY VANILLA",\n    "company name": "THE GREEK GODS",\n    "brand name": "THE GREEK GODS"\n  },\n  "product size": {\n    "full statement about product size": "NET WT 32 OZ ( 2 LB ) 907g",\n    "primary size": "32 OZ",\n    "secondary size": "2 LB",\n    "third size": "907g",\n    "count": null,\n    "count uom": null\n  }\n}\nEND_HEADER_OBJECT\n\nBASE_CERTIFIER_CLAIM_TABLE\n| claim | is product claim that ? (answer is yes/no/unknown) |\n| ------- | -------- |\n| bee friendly claim | unknown |\n| bio-based claim | unknown |\n| biodynamic claim | unknown |\n| bioengineered claim | unknown |\n| cbd cannabidiol / help claim | unknown |\n| carbon footprint claim | unknown |\n| certified b corporation | unknown |\n| certified by international packaged ice association | unknown |\n| cold pressure verified | unknown |\n| cold pressure protected claim | unknown |\n| cradle to cradle claim | unknown |\n| cruelty free claim | unknown |\n| diabetic friendly claim | unknown |\n| eco fishery claim | unknown |\n| fair trade claim | unknown |\n| for life claim | unknown |\n| use GMO claim | unknown |\n| gmp claim | unknown |\n| gluten-free claim | unknown |\n| glycemic index claim | unknown |\n| glyphosate residue free claim | unknown |\n| grass-fed claim | unknown |\n| halal claim | unknown |\n| hearth healthy claim | unknown |\n| Keto/Ketogenic Claim | unknown |\n| Kosher Claim | unknown |\n| Live and Active Culture Claim | yes |\n| Low Glycemic Claim | unknown |\n| New York State Grown & Certified Claim | unknown |\n| Non-GMO Claim | unknown |\n| Organic Claim | unknown |\n| PACA Claim | unknown |\n| PASA Claim | unknown |\n| Paleo Claim | unknown |\n| Plant Based/Derived Claim | unknown |\n| Rain Forest Alliance Claim | unknown |\n| Vegan Claim | unknown |\n| Vegetarian Claim | unknown |\n| Viticulture Claim | unknown |\n| Whole Grain Claim | unknown |\nEND_BASE_CERTIFIER_CLAIM_TABLE\n\nINGREDIENT_TABLE\n| product type from nutrition panel ? (answer is "nutrition facts" / "supplement facts" / "unknown") | prefix text of ingredient list (answer are "other ingredients:" / "ingredients:") | ingredient statement | ingredient break-down list from ingredient statement (each ingredient splitted by "/") | live and active cultures list statement | live and active cultures break-down list (each item splitted by "/")  | \n| ------- | ------- | -------- | -------- | -------- | -------- |\n| nutrition facts | INGREDIENTS: | CULTURED PASTEURIZED GRADE A MILK , BROWN CANE SUGAR , CANE SUGAR , CREAM , HONEY , PECTIN , NATURAL FLAVOR , VANILLA EXTRACT . | CULTURED PASTEURIZED GRADE A MILK/BROWN CANE SUGAR/CANE SUGAR/CREAM/HONEY/PECTIN/NATURAL FLAVOR/VANILLA EXTRACT | CONTAINS 7 LIVE AND ACTIVE CULTURES | S. THERMOPHILUS/B.'
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
