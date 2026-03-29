type DaumPostcodeData = {
  zonecode: string;
  address: string;
};

type DaumPostcodeOptions = {
  oncomplete: (data: DaumPostcodeData) => void;
};

interface DaumPostcodeInstance {
  open: () => void;
}

interface Window {
  daum?: {
    Postcode: new (options: DaumPostcodeOptions) => DaumPostcodeInstance;
  };
}
