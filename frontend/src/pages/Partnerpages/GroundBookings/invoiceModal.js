import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import InvoiceDetails from '../../../Components/Common/InvoiceDetails';
const DisplayInvoice = ({
  groundData,
  displayInvoiceModal,
  isDisplayInvoiceModal,
}) => {
  return (
    <Modal
      size="xl"
      isOpen={isDisplayInvoiceModal}
      toggle={() => {
        displayInvoiceModal();
      }}
    >
      <ModalHeader
        className="modal-title"
        id="myExtraLargeModalLabel"
        toggle={() => {
          displayInvoiceModal();
        }}
      >
        Invoice
      </ModalHeader>
      <ModalBody className="p-2">
        <InvoiceDetails data={groundData} closeModal={displayInvoiceModal} />
        {/* <h6 className="fs-15">Give your text a good structure</h6>
        <div className="d-flex">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2">
            <p className="text-muted mb-0">
              Raw denim you probably haven't heard of them jean shorts Austin.
              Nesciunt tofu stumptown aliqua, retro synth master cleanse.
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              Too much or too little spacing, as in the example below, can make
              things unpleasant for the reader. The goal is to make your text as
              comfortable to read as possible.{' '}
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              In some designs, you might adjust your tracking to create a
              certain artistic effect. It can also help you fix fonts that are
              poorly spaced to begin with.
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              For that very reason, I went on a quest and spoke to many
              different professional graphic designers and asked them what
              graphic design tips they live.
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              You've probably heard that opposites attract. The same is true for
              fonts. Don't be afraid to combine font styles that are different
              but complementary, like sans serif with serif, short with tall, or
              decorative with simple. Qui photo booth letterpress, commodo enim
              craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR.
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              For that very reason, I went on a quest and spoke to many
              different professional graphic designers and asked them what
              graphic design tips they live.
            </p>
          </div>
        </div>
        <h6 className="fs-16 my-3">Graphic Design</h6>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              Opposites attract, and that’s a fact. It’s in our nature to be
              interested in the unusual, and that’s why using contrasting colors
              in Graphic Design is a must. It’s eye-catching, it makes a
              statement, it’s impressive graphic design. Increase or decrease
              the letter spacing depending.
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art
              party before they sold out master cleanse gluten-free squid
              scenester freegan cosby sweater.
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              Just like in the image where we talked about using multiple fonts,
              you can see that the background in this graphic design is blurred.
              Whenever you put text on top of an image, it’s important that your
              viewers can understand.
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <i className="ri-checkbox-circle-fill text-success"></i>
          </div>
          <div className="flex-grow-1 ms-2 ">
            <p className="text-muted mb-0">
              Keytar raw denim keffiyeh etsy art party before they sold out
              master cleanse gluten-free squid scenester freegan cosby sweater.
            </p>
          </div>
        </div> */}
      </ModalBody>
      {/* <div className="modal-footer">
        <Button color="danger" onClick={() => displayInvoiceModal()}>
          Close
        </Button>
      </div> */}
    </Modal>
  );
};

export default DisplayInvoice;
