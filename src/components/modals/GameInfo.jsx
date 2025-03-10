import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

function GameInfo({handler}) {

  return (
    <>
      {/* <Button onClick={handler.onOpen}>Open Modal</Button> */}

      <Modal isOpen={handler.isOpen} onClose={handler.onClose} isCentered size="sm" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="peyda" fontWeight="bold" textAlign="right" >توضیحات بازی</ModalHeader>
          <ModalBody textAlign="right" fontFamily="peyda" fontWeight="bold" display="flex" flexDirection="column" gap={6} >
            <p> 🎮🃏 سلام! به بازی نوروزی لیبرتو خوش اومدی</p>
            <p>توی این بازی، ۱۲ تا کارت به پشت روی صفحه چیده شده و باید با برگردوندنشون، جفت‌های همسان رو پیدا کنی. هر بار می‌تونی دوتا کارت رو ببینی—اگه مثل هم باشن، حذف می‌شن؛ اگه نه، دوباره برمی‌گردن سر جاشون. هدف اینه که تو کمترین زمان، همه جفت‌ها رو پیدا کنی!</p>
            <p>هر روز ۵ بار میتونی بیای بازی کنی و رکوردتو ثبت کنی (امروز یک شانس اضافه میدم که دستت گرم بشه 😉)</p>
            <p>و اما جایزه، آخر هر روز به ۳ نفر اولی که بهترین رکورد رو زده باشن جایزه داده میشه. جایزه هم به این صورته : نفر اول ۵۰ درصد! نفر دوم ۲۰ درصد و نفر سوم ۱۰ درصد تخفیف خرید از سایت دریافت می کنن که یک هفته فرصت استفاده از کد تخفیف وجود داره</p>
            <p>حافظه، سرعت و دقتت تعیین می‌کنه که چقدر سریع می‌تونی برنده بشی. می‌تونی رکورد بزنی؟ 🚀</p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" fontFamily="peyda" mr={3} onClick={handler.onClose}>
              بریم رکورد بزنیم
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GameInfo;
