import { ReactComponent as EmptyIcon } from '../../assets/images/empty.svg'

const EmptyState = () => {
    return (
        <>
        <h3 className='text-center'>No record found</h3>
        <div className="d-flex justify-content-center">
          <EmptyIcon width={400} height={400}/>
        </div>
      </>
    );
};

export default EmptyState