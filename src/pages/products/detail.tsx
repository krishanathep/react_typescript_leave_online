import { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import Preloader from "../../components/Preloader";
import axios from "axios";

type resultProps = {
  idMeal: number;
  strMealThumb: string;
  strMeal: string;
  strInstructions: string;
};

const Detail = () => {
  const {id} = useParams();
  const [meals, setMeals] = useState<resultProps[]>([]);
  const [loading,setLoading] = useState(false)

  const getData = async () => {
    try {
    setLoading(true)
      await axios
        .get("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
        .then((res) => {
          console.log(res.data.meals);
          setMeals(res.data.meals);
        });
    } catch (error) {
      console.log(error);
    } finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if(loading === true) {
    return(
      <Preloader/>
    )
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Products detail</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Products</li>
                  <li className="breadcrumb-item active">Detail</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-1"></div>
              {meals.map((meal) => (
                <div className="col-md-10" key={meal.idMeal}>
                  <div className="card mt-3 mb-5">
                    <img src={meal.strMealThumb} height={600} alt="meals-img" className="card-img-top"/>
                    <div className="card-body">
                      <h5 className="card-title">{meal.strMeal}</h5>
                      <p className="card-text text-muted">
                        {meal.strInstructions}
                      </p>
                      <div className="float-right">
                      <Link to={'/products'} className="btn btn-danger">Go back</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="col-md-1"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
