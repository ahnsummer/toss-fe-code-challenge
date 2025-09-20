import { FormModal } from "../shared/components/FormModal";
import { Modal } from "../shared/components/Modal";
import { useOverlay } from "../shared/overlay/useOverlay";

const ModalFormPage = () => {
  const overlay = useOverlay();

  return (
    <div>
      <button
        onClick={async (e) => {
          await overlay.open(({ close }) => (
            <FormModal
              onSubmit={(formValues) => {
                console.log("submit", formValues);
                close();
              }}
              onClose={close}
              title="제목임"
              forms={[
                { key: "name", label: "이름", type: "text" },
                {
                  key: "email",
                  label: "이메일",
                  type: "email",
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
                { key: "password", label: "비밀번호", type: "password" },
              ]}
            />
          ));

          (e.target as HTMLElement).focus();
        }}
        tabIndex={1}
        className="focus:bg-black"
      >
        Open Modal
      </button>
    </div>
  );
};

export default ModalFormPage;
