import { OrderShow } from "../ShowOrder";

export const OrderCart = ({
  showOrder,
  orders,

  Role,
  setEditShow,
  orderStats,
  setOrderId,
  editShow,
  handelOrderCancel,
  PaymentStatus,
  setPaymentStatus,
}) => {
  return (
    <>
      {showOrder && (
        <>
          <div className="flex flex-wrap gap-1">
            <OrderShow
              editShow={editShow}
              Role={Role}
              Orders={orders}
              orderStats={orderStats}
              handelOrderCancel={(id) => handelOrderCancel(id)}
              setEditShow={setEditShow}
              setOrderId={setOrderId}
              PaymentStatus={PaymentStatus}
              setPaymentStatus={setPaymentStatus}
            />
          </div>
        </>
      )}
    </>
  );
};
