import { useRouter, usePathname } from 'next/navigation';

const useRouting = () => {
  const router = useRouter();
  const pathName = usePathname();

  const historyPush = (url: string) => {
    router.push(url);
  };

  const historyRefresh = () => {
    router.refresh();
  };

  const historyReplace = (url: string) => {
    router.replace(url);
  };

  return {
    historyPush,
    historyRefresh,
    historyReplace,
    pathName,
    router,
  };
};

export { useRouting };
