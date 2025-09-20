import { FormModal } from "../shared/components/FormModal";
import { Modal } from "../shared/components/Modal";
import { useOverlay } from "../shared/overlay/useOverlay";

const ModalFormPage = () => {
  const overlay = useOverlay();

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={async (e) => {
          await overlay.open(({ close }) => (
            <FormModal
              onSubmit={(formValues) => {
                console.log("submit", formValues);
                close();
              }}
              onClose={close}
              title="신청 폼"
              forms={[
                { key: "name", label: "이름 / 닉네임", inputType: "text" },
                {
                  key: "email",
                  label: "이메일",
                  inputType: "email",
                  validate: (value) => {
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
              ]}
            />
          ));

          (e.target as HTMLElement).focus();
        }}
        tabIndex={1}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        신청 폼 작성하기
      </button>
    </div>
  );
};

export default ModalFormPage;
