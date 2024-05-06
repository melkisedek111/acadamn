import { useToast } from '@/components/ui/use-toast';
import { TFetchApiError } from '@/helpers/fetch'

const useErrorHandler = () => {
    const { toast } = useToast();

    const handleNoError = (response: TFetchApiError | any, title: string): boolean => {
        
        if (response) {
            if (typeof response === "object") {
                if ("error" in response) {
                    for (const error of response.details) {
                        toast({
                            title,
                            variant: "destructive",
                            description: error.message,
                        })
                    }
                    return false;
                }
            }
        }

        return true;
    }

    return { handleNoError }
}

export default useErrorHandler