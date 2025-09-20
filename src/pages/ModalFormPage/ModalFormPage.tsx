import { Button } from "../../shared/components/Button";
import { FormModal } from "../../shared/components/FormModal";
import { useOverlay } from "../../shared/overlay/useOverlay";
import { MODAL_FORM } from "./ModalFormPage.constants";

const ModalFormPage = () => {
  const overlay = useOverlay();

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Button
          onClick={async (e) => {
            await overlay.open(({ close }) => (
              <FormModal
                onSubmit={(formValues) => {
                  console.log("submit", formValues);
                  close();
                }}
                onClose={close}
                title="신청 폼"
                forms={MODAL_FORM}
              />
            ));

            (e.target as HTMLElement).focus();
          }}
          tabIndex={1}
        >
          신청 폼 작성하기
        </Button>
      </div>
    </>
  );
};

export default ModalFormPage;
