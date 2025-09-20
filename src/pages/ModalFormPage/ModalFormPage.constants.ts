import type { FormItem } from "../../shared/components/FormModal";

export const MODAL_FORM: FormItem[] = [
  { key: "name", label: "이름 / 닉네임", inputType: "text" },
  {
    key: "email",
    label: "이메일",
    inputType: "email",
    validate: (value: string) => {
      if (value.length < 4) {
        return {
          isValid: false,
          errorMessage: "이메일은 4자 이상이어야 합니다.",
        };
      }

      return { isValid: true };
    },
  },
  {
    key: "experienceYears",
    label: "FE 경력 연차",
    type: "select",
    options: [
      { label: "0-3년", value: "0-3" },
      { label: "3-7년", value: "3-7" },
      { label: "8년 이상", value: "8+" },
    ],
  },
  {
    key: "github",
    label: "GitHub 링크 (선택)",
    inputType: "text",
  },
];
