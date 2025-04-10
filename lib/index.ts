export type Meta = {
  key: string;
  name: string;
  description: string;
};
export type IntegrationMeta = Meta;
export type BlockMeta = Meta;
export type ConnectionMeta = Meta;

export type BlockInputFieldTypes =
  | "switcher"
  | "text"
  | "textPlain"
  | "textArea"
  | "sqlArea"
  | "jsArea"
  | "jsonArea"
  | "numberPlain"
  | "select"
  | "multiSelect"
  | "keyValue";

export type ConnectionInputFieldTypes = "textPlain" | "password" | "button";

export type BlockInputField = {
  key: string;
  type: BlockInputFieldTypes;
  label: string;
  description?: string;
  required: boolean;
} & (
  | {
      type: "select" | "multiSelect";
      choices: Record<string, string> | { label: string; value: string }[] | string[];
    }
  | { type: Exclude<BlockInputFieldTypes, "select" | "multiSelect"> }
) &
  (
    | {
        type: "keyValue";
        label2: string;
        subFieldKeyType: string;
        subFieldValueType: string;
        keys: string[];
      }
    | { type: Exclude<BlockInputFieldTypes, "keyValue"> }
  );

export type ConnectionInputField = {
  key: string;
  type: ConnectionInputFieldTypes;
  label: string;
  required: boolean;
} & (
  | {
      type: "button";
      executeWithRedirect?: (service: ExecuteService, bundle: ExecuteBundle) => void;
      executeWithSaveFields?: (service: ExecuteService, bundle: ExecuteBundle) => Record<string, any>;
      executeWithMessage?: (service: ExecuteService, bundle: ExecuteBundle) => void | string;
    }
  | {
      type: Exclude<ConnectionInputFieldTypes, "button">;
      executeWithRedirect?: never;
      executeWithSaveFields?: never;
      executeWithMessage?: never;
    }
);

export type RequestConfig =
  | {
      url: string;
      method: "GET";
      headers?: Record<string, string>;
      // jsonBody и multipartBody недоступны для GET
    }
  | {
      url: string;
      method: "POST" | "PATCH" | "PUT" | "DELETE";
      headers?: Record<string, string>;
      jsonBody?: any;
      multipartBody?: any;
    };

export type RequestResult = {
  status: number;
  response: any;
};

export type ExecuteServiceError = {
  stringError: (message: string) => void;
  cause: (message: string) => void;
};

export type ExecuteService = {
  base64Encode: (input: string) => string;
  base64Decode: (input: string) => string;
  request: (config: RequestConfig) => RequestResult;
  error: ExecuteServiceError;
  console: (input: string) => void;
};

export type ExecuteBundle = {
  inputData: Record<string, any>;
  authData: Record<string, any>;
};

type BlockContext = {};

export type ExecuteResult = {
  output_variables: any[];
  output: any[];
  state: Record<string, any>;
  hasNext: boolean;
};

export type IntegrationBlockExecute = (
  this: null,
  service: ExecuteService,
  bundle: ExecuteBundle,
  context: BlockContext
) => ExecuteResult;


export type IInputFields = Array<
  | BlockInputField
  | ((service: ExecuteService, bundle: ExecuteBundle) => BlockInputField[])
>;

export type IntegrationBlock = {
  meta: BlockMeta;
  inputFields: IInputFields;
  executePagination: IntegrationBlockExecute;
};

export type IntegrationConnection = {
  meta: ConnectionMeta;
  inputFields: ConnectionInputField[];
  execute: () => void;
};

export type Integration = {
  schema: number;
  meta: IntegrationMeta;
  blocks: IntegrationBlock[];
  connections: IntegrationConnection[];
};

declare global {
  var integration: Integration;
}

export {};
