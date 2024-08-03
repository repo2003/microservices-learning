import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

import ModalDeleteCustom from '@commonItems/ModalDeleteCustom';
import { handleDeletingResponse } from '@commonServices/ResponseStatusHandlingService';
import type { TaxRate } from '@taxModels/TaxRate';
import { deleteTaxRate, getPageableTaxRates } from '@taxServices/TaxRateService';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, TAX_RATE_URL } from 'constants/Common';

const TaxRateList: NextPage = () => {
  const [taxRateIdWantToDelete, setTaxRateIdWantToDelete] = useState<number>(-1);
  const [taxRateNameWantToDelete, setTaxRateNameWantToDelete] = useState<string>('');
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState<number>(DEFAULT_PAGE_NUMBER);
  const [totalPage, setTotalPage] = useState<number>(1);

  const handleClose: any = () => setShowModalDelete(false);
  const handleDelete: any = () => {
    if (taxRateIdWantToDelete == -1) {
      return;
    }
    deleteTaxRate(taxRateIdWantToDelete)
      .then((response) => {
        setShowModalDelete(false);
        handleDeletingResponse(response, taxRateNameWantToDelete);
        setPageNo(DEFAULT_PAGE_NUMBER);
        getListTaxRate();
      })
      .catch((error) => console.log(error));
  };

  const getListTaxRate = () => {
    getPageableTaxRates(pageNo, DEFAULT_PAGE_SIZE)
      .then((data) => {
        setTotalPage(data.totalPages);
        setTaxRates(data.taxRateGetDetailContent);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setLoading(true);
    getListTaxRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  const changePage = ({ selected }: any) => {
    setPageNo(selected);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!taxRates) return <p>No Tax Rate</p>;
  return (
    <>
      <div className="row mt-5">
        <div className="col-md-8">
          <h2 className="text-danger font-weight-bold mb-3">Tax rate</h2>
        </div>
        <div className="col-md-4 text-right">
          <Link href={`${TAX_RATE_URL}/create`}>
            <Button>Create tax rate</Button>
          </Link>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Tax Class</th>
            <th>Country</th>
            <th>State Or Province</th>
            <th>Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxRates.map((taxRate) => (
            <tr key={taxRate.id}>
              <td>{taxRate.id}</td>
              <td>{taxRate.taxClassName}</td>
              <td>{taxRate.countryName}</td>
              <td>{taxRate.stateOrProvinceName}</td>
              <td>{taxRate.rate}</td>
              <td>
                <Link href={`${TAX_RATE_URL}/${taxRate.id}/edit`}>
                  <button className="btn btn-outline-primary btn-sm" type="button">
                    Edit
                  </button>
                </Link>
                &nbsp;
                <button
                  className="btn btn-outline-danger btn-sm"
                  type="button"
                  onClick={() => {
                    setShowModalDelete(true);
                    setTaxRateIdWantToDelete(taxRate.id);
                    setTaxRateNameWantToDelete(taxRate.id.toString());
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalDeleteCustom
        showModalDelete={showModalDelete}
        handleClose={handleClose}
        nameWantToDelete={taxRateNameWantToDelete}
        handleDelete={handleDelete}
        action="delete"
      />
      <ReactPaginate
        forcePage={pageNo}
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={totalPage}
        onPageChange={changePage}
        containerClassName={'pagination-container'}
        previousClassName={'previous-btn'}
        nextClassName={'next-btn'}
        disabledClassName={'pagination-disabled'}
        activeClassName={'pagination-active'}
      />
    </>
  );
};

export default TaxRateList;
