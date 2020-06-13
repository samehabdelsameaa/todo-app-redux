import React, { Component } from 'react';
import { FaRegCheckCircle, FaCircle, FaRegTrashAlt } from 'react-icons/fa';

export class Todo extends Component {
    state = {
        todos: [],
        isLoading: true,
        _todos: [],
    }

    componentDidMount() {
        localStorage.length > 0 && JSON.parse(localStorage.getItem('todos')) > 0
            ? this.setState({todos: JSON.parse(localStorage.getItem('todos')), _todos: JSON.parse(localStorage.getItem('todos'))})
            : this.fetchData();
    }

    handleChange = (e) => {
        const { todos } = this.state;
        let filteredItems = todos && todos.filter(item => item.title.toLowerCase().startsWith(
            (e.target.value).toLowerCase()
        ));
        this.setState({ _todos: filteredItems })
    }

    fetchData = () => {
        let url = `https://jsonplaceholder.typicode.com/todos`;
        fetch(url)
            .then(response => response.json())
            .then(result => {
                this.setState({ todos: result, _todos: result.slice(0, 20), isLoading: false })
                localStorage.setItem('todos', JSON.stringify(this.state.todos));
            })
            .catch(e => console.log(e, 'error in fetching'))
    }

    loadMoreData = () => {        
        this.setState({_todos: [...this.state._todos, 
            ...this.state.todos.slice(this.state._todos.length, this.state._todos.length + 20)]
        })
    }

    removeCurrentItem = id => {
        const { _todos } = this.state;
        let todoList = _todos.filter(item => item.id !== id);
        this.setState({ _todos: todoList });
    }

    toggleItem = id => {
        const { _todos } = this.state;
        let todoList = _todos.map(item => {
            if (item.id === id)
                item.completed = !item.completed
            return item;
        });
        this.setState({ _todos: todoList });
    }

    addItem = text => {
        let newItem = {
            userId: 1,
            id: this.state.todos.length,
            title: text,
            completed: false
        }
        this.setState({
            _todos: [newItem, ...this.state._todos],
            todos: [newItem, ...this.state.todos]
        });
    }

    showAllCompleted = () => {
        const todoList = this.state.todos.filter( item => item.completed === true)
        this.setState({
            _todos: todoList
        })
    }

    showAll = () => {
        this.setState({
            _todos: this.state.todos
        })
    }

    handleScroll = (e) => {
        let element = e.target;
        if(element.scrollTop + element.clientHeight >= element.scrollHeight){
            this.loadMoreData()
        }
    }

    render() {
        const { isLoading, searchValue, _todos } = this.state;

        return (
            <div className='container'>
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            onChange={this.handleChange}
                            value={searchValue}
                        />
                        <div className="bg-white my-3 rounded shadow-sm">
                            <h6 className="border-bottom border-gray p-3 mb-0">
                                Recent updates
                                <span 
                                    style={{float:'right', marginLeft: 8, cursor: 'pointer'}}
                                    onClick={() => this.showAll()}
                                > 
                                    All 
                                </span>
                                <span 
                                    style={{float:'right', cursor: 'pointer'}}
                                    onClick={() => this.showAllCompleted()}
                                > 
                                    completed  |
                                </span>
                            </h6>
                            <div className="scroll-wrapper p-3" style={{ height: 450, overflow: 'auto' }} onScroll={(e) => this.handleScroll(e)}>
                                {
                                    (isLoading)
                                        ? <p className="text-center"> Loading.... </p>
                                        : _todos && _todos.map((item, i) => (
                                            <TodoItem key={i}
                                                todoItem={item}
                                                removeItem={(id) => this.removeCurrentItem(id)}
                                                toggleCompletedItem={(id) => this.toggleItem(id)}
                                            />
                                        ))
                                }

                                <small className="d-block text-right mt-3">
                                    <a href="/">All updates</a>
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <AddForm
                            addNewItem={text => this.addItem(text)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Todo;

export class AddForm extends Component {
    state = {
        text: ''
    }

    handleChange = e => {
        this.setState({ text: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.addNewItem(this.state.text);
        this.resetForm();
    }

    resetForm = () => this.setState({ text: '' });

    render() {
        const { text } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-inline">
                    <input type="text" className="form-control" onChange={this.handleChange} value={text} />
                    <button className="btn btn-primary ml-3" type="submit"> + Add </button>
                </div>
            </form>
        )
    }
}

export const TodoItem = ({ todoItem: { title, id, completed }, toggleCompletedItem, removeItem }) => (
    <div className="media text-muted pt-3">
        <div onClick={() => toggleCompletedItem(id)} id="test-id_toggle">
            {
                (completed)
                ? <FaRegCheckCircle style={{ marginRight: 5, color: '#3ADF00', fontSize: 22 }} />
                : <FaCircle style={{ marginRight: 5, fontSize: 22 }} />
            }
        </div>

        <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong className="d-block text-gray-dark">@username</strong>
            <span style={{ textDecoration: completed ? 'line-through' : '' }} id="test-id_title"> {title} </span>
        </p>

        <FaRegTrashAlt onClick={() => removeItem(id)} />
    </div>
)