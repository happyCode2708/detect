'use client';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
// import ExtractionHistory from '@/components/extract-history/ExtractionHitory';
import {
  useMutateGetCompareResultWithTdc,
  useMutateProductExtraction,
  useMutateUploadFile,
} from '@/queries/home';
import { FluidContainer } from '@/components/container/FluidContainer';
import { Result } from '@/components/result/Result';
import { useQueryClient } from '@tanstack/react-query';
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
import { useQueryProductsFromTdc } from '@/queries/productDetailQuery';

const ProductDetailPage = () => {
  const { ixoneid } = useParams();

  const [files, setFiles] = useState<any>([]);
  const [productInfo, setProductInfo] = useState(null);
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

  const mutationProductExtract = useMutateProductExtraction();
  const mutateGetCompareResultWithTdc = useMutateGetCompareResultWithTdc();

  const router = useRouter();

  const { data: compareResultResponse } = mutateGetCompareResultWithTdc;
  const compareResultData = compareResultResponse?.data;

  console.log('haha', compareResultData);

  const { data: tdcData } = useQueryProductsFromTdc({
    ixoneIDs: typeof ixoneid === 'string' ? [ixoneid] : [],
  });
  const queryClient = useQueryClient();

  // console.log(tdcData);

  const { toast } = useToast();

  const imageUrls = productIxone?.images?.map((item: any) => item?.url);

  useEffect(() => {
    if (ixoneid) {
      const fetchProduct = async () => {
        const response = await fetch(`/api/product/${ixoneid}`);
        const data = await response.json();

        const productData = data?.data;

        if (!productData) return;

        setProductIxone(productData);

        const newestSessionData = productData?.extractSessions[0];
        if (newestSessionData) {
          setProductInfo(JSON.parse(newestSessionData?.result));
          setPdSessionId(newestSessionData?.sessionId);
        }
      };
      fetchProduct();
    }
  }, [ixoneid]);

  useEffect(() => {
    if (pdSessionId || sessionId) {
      mutateGetCompareResultWithTdc.mutate({ ixoneid });
    }
  }, [pdSessionId, ixoneid, sessionId]);

  const handleSubmitImageUrl = async () => {
    const formData = new FormData();

    formData.append('imageUrls', JSON.stringify(imageUrls));

    // Append other form data
    formData.append('biasForm', JSON.stringify(biasForm));
    formData.append('outputConfig', JSON.stringify(outputConfig));

    const payload = {
      biasForm: JSON.stringify(biasForm),
      outputConfig: JSON.stringify(outputConfig),
      ixoneId: ixoneid,
    };

    setLoading(true);
    setProductInfo(null);

    mutationProductExtract.mutate(payload, {
      onError: (e) => {
        console.log(e);
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
          toast({
            title: 'Info',
            description: (
              <div>
                {messages?.map((messageItem: string | null) => {
                  if (messageItem) {
                    return <div className='mb-2'>{messageItem} </div>;
                  }
                  return null;
                })}
              </div>
            ),
            variant: 'destructive',
            duration: 7000,
          });
        }
        setSessionId(sessionId);
        queryClient.invalidateQueries({ queryKey: ['history'] });
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

            mutateGetCompareResultWithTdc.mutate({ ixoneid });
            setLoading(false);
          }
        } catch (error) {
          console.error('some thing went wrong', error);
          if (refInterval.current) {
            clearInterval(refInterval.current);
          }
          setLoading(false);
        }
      }, 4000);
    }
    return () => {
      if (!refInterval.current) return;

      window.clearInterval(refInterval.current);
    };
  }, [sessionId]);

  if (!productIxone) {
    return <div>Loading...</div>;
  }

  return (
    <FluidContainer>
      <div className='flex flex-col gap-4 py-4 px-4'>
        <div className='gap-2'>
          <div>
            <div className='flex justify-end'>
              <Button variant={'outline'} onClick={() => router.push('/')}>
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
                <div className='w-[80px] max-h-[80px] flex justify-center align-middle p-2'>
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
                // onClick={handleSubmit}
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
              {loading && (
                <Button variant='secondary' onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </SectionWrapper>
        </div>

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
                  (biasImage: [key: string, value: any]) => {
                    const [key, value] = biasImage;

                    const isShow = value?.haveNutFact === true;

                    if (isShow === false) return null;

                    return (
                      <div className='flex flex-row mb-2'>
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
