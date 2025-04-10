import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Preloader from "../../components/Preloader";

type resultProps = {
  idMeal: number;
  strMealThumb: string;
  strMeal: string;
};

const Products = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [meals, setMeals] = useState<resultProps[]>([]);
  const [food, setFood] = useState<string>("");
  const [dataFilter] = useState<string[]>(["strMeal"]);

  const getData = async () => {
    try {
      setLoading(true);
      await axios
        .get("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
        .then((res) => {
          console.log(res.data.meals);
          setMeals(res.data.meals);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchFood =(meals:any)=>{
    return meals.filter((item:any)=>{
      return dataFilter.some((filter)=>{
       return item[filter].toString().toLowerCase().indexOf(food.toLowerCase())>-1
      })
    })
  }

  useEffect(() => {
    getData();
  }, []);

  if (loading === true) {
    return <Preloader />;
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Products search easy</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Products</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <input 
                    type="search" 
                    value={food}
                    onChange={(e)=>setFood(e.target.value)}
                    className="form-control" 
                    placeholder="Search" />
                  </div>
                </div>
              </div>
              {searchFood(meals).map((meal:resultProps) => (
                <div className="col-md-2" key={meal.idMeal}>
                  <div className="card">
                    <Link to={"/products/detail/" + meal.idMeal}>
                      <img
                        src={meal.strMealThumb}
                        alt="meals-img"
                        className="card-img-top"
                      />
                    </Link>
                    <div className="card-body">
                      <h4 className="card-title">
                        {meal.strMeal.substring(0, 18)}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
