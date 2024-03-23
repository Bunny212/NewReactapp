import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as articleActions from '../redux/actions/articleActions';
import PropTypes from 'prop-types';
import { Dispatch , bindActionCreators } from "redux";
import { IArticleReduxProps, IArticleList, Target } from '../types/interfaces';
import { v4 as uuidv4 } from 'uuid';

const ArticleList = ({articles, actions}: IArticleList) => {

  useEffect(() => {
      console.log('calling articles', articles);
      console.log('calling articles', actions);
      actions.getArticles();
  }, []);

  const [formData, setFormData] = useState({id: 0, title: '', body: ''});

  // const [items, setItems] = useState([
  //     { id: uuidv4(), title: 'article 1', body: 'body 1' },
  //     { id: uuidv4(), title: 'article 2', body: 'body 2' },
  //     { id: uuidv4(), title: 'article 3', body: 'body 3' },
  //     { id: uuidv4(), title: 'article 4', body: 'body 4' }
  //
  // ]);
  // const handleToggle = () => setIsOpen(!isOpen);

  const guestLinks = (
    <>
      Item 1
      Item 2
    </>
  );

  // const { items } = this.state;
  const handleAdd = () => {
    // const itemsList = [...items, { id: uuidv4(), title: 'article 5', body: 'body 5' }];
    // setItems((items) => {
    //   items: [...items, { id: uuidv4(), title: 'article 5', body: 'body 5' }];
    // });
    // console.log(items);

    // setItems([ ...items, { id: uuidv4(), title: 'article 5', body: 'body 5' } ]);

  }

  const { articles: articlesData } = articles;
  const handleDelete = (id: number) => {
    console.log(id);
    actions.deleteArticle(id);
    // const itemsList = items.filter(item => item.id !== id);
    // setItems([ ...itemsList ]);
  }

  const onFormChange = (e: Target) => {
    console.log(e);
    console.log(e.target.value);
    setFormData({...formData, [e.target.name]: e.target.value})
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('form submitted');
    console.log(formData);
    // const { title, body } = formData;
    const newArticle = {
      ...formData,
      // id: 1,
      // title,
      // body,
      // title: formData.name,
      // body: formData.body
    }
    console.log(newArticle);
    actions.addArticle(newArticle);
  };

  return (
    <>
    <div className="container-fluid">
  	<div className="row">
      	<div className="card">
          	<div className="card-header">
              	<h3>Data Entry Form</h3>
              </div>
              <div className="card-body">
              	<form className="form-horizontal" role="form" onSubmit={(e) => handleSubmit(e)}>
                      <div className="row">
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">Name</label>
                              <div className="col-sm-9">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Name"
                                    required
                                    name="title"
                                    onChange={(e) => onFormChange(e)}
                                  />
                              </div>
                          </div>
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">
                                  Headline</label>
                              <div className="col-sm-9">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="headline"
                                    placeholder="Headline"
                                    name="body"
                                    onChange={(e) => onFormChange(e)}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">
                                  Biography</label>
                              <div className="col-sm-9">
                                  <textarea className="form-control" rows={2} id="biograpghy"></textarea>
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">
                                  Location</label>
                              <div className="col-sm-9">
                                  <input type="text" className="form-control" id="location" placeholder="Location" />
                              </div>
                          </div>
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">
                                  Work</label>
                              <div className="col-sm-9">
                                  <input type="text" className="form-control" id="work" placeholder="Work" />
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">
                                  Education</label>
                              <div className="col-sm-9">
                                  <input type="text" className="form-control" id="Education" placeholder="Education" />
                              </div>
                          </div>
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">
                                  Interests</label>
                              <div className="col-sm-9">
                                  <input type="text" className="form-control" id="Interests" placeholder="EducInterestsation" />
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="form-group col-md-6">
                              <label className="col-sm-3 control-label">
                                  Bio Photo</label>
                              <div className="col-sm-9">
                                  <input type="file" className="form-control" id="photo" />
                              </div>
                          </div>
                          <div className="form-group col-md-6">
                              <div className="col-sm-offset-3 col-sm-9">
                                  <div className="checkbox">
                                      <label>
                                          <input type="checkbox" />
                                          Display my tag
                                      </label>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="text-right">
                        <button
                          className="btn btn-primary"
                        >
                          SUBMIT
                        </button>
                      </div>
              	</form>

              </div>
              <div className="clear pad-5"></div>
              <div className="card-header">
              	<div className="row">
                  	<div className="col-sm-8"><h3>Data Entry Form</h3></div>
                      <div className="col-sm-4">
                          <div className="input-group">
        						<input type="text" className="form-control" placeholder="Search for..." />
        						<span className="input-group-btn">
          						<button className="btn btn-info" type="button">Search</button>
        						</span>
      					</div>
                      </div>
                  </div>
              </div>
              <div className="card-body">

              	<div className="table-responsive">
                      <table className="table table-bordered table-striped">
                          <thead>
                              <tr>
                                  <th>
                                      <input type="checkbox" />
                                  </th>
                                  <th>
                                      Title
                                  </th>
                                  <th>
                                      Body
                                  </th>
                                  <th>
                                      Action
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                            {articlesData.map((article) => {
                              return (
                                <tr key={article.id}>
                                  <td>
                                      <input type="checkbox"/>
                                  </td>
                                  <td>
                                      <strong>{article.title}</strong>
                                  </td>
                                  <td>
                                      {article.body}
                                  </td>
                                  <td>

                                      <a
                                        href="#"
                                        title="Edit"
                                        className="text_grey_d"
                                      >
                                        <i className="fa fa-edit fa-lg"></i>
                                      </a>
                                      <a
                                        href="#"
                                        title="Edit"
                                        className="text_red"
                                        onClick={() => handleDelete(article.id)}
                                      >
                                        <i className="fa fa-times-circle fa-lg"></i>
                                      </a>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                      </table>
                      <ul className="pagination center-block">
                          <li><a href="#">«</a></li>
                          <li><a href="#">1</a></li>
                          <li><a href="#">2</a></li>
                          <li><a href="#">3</a></li>
                          <li><a href="#">4</a></li>
                          <li><a href="#">5</a></li>
                          <li><a href="#">»</a></li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  </div>
    </>
  );
};

ArticleList.propTypes = {
  // articles: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: IArticleReduxProps) => ({
  articles: state.articles
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getArticles: bindActionCreators(articleActions.getArticles, dispatch),
    addArticle: bindActionCreators(articleActions.addArticle, dispatch),
    deleteArticle: bindActionCreators(articleActions.deleteArticle, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleList);
