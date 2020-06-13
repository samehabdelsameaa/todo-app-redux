import React from 'react';
import { shallow, mount } from 'enzyme';
import { TodoItem, AddForm, Todo } from './Todo';
import { FaRegTrashAlt } from 'react-icons/fa';

describe('test todo app', () => {
    describe('test TodoItems Component ', () => {
        const component = mount(<Todo />);
        it('renders todo component without errors', () => {
            expect(component.length).toBe(1);
        });
        it('call fetch data on mount', () => {
            let instance = component.instance();
            let fetchSpy = jest.spyOn(instance, 'fetchData');
            instance.componentDidMount();
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });
        it('add new item when click add', () => {
            let instance = component.instance();
            let addNew = jest.spyOn(instance, 'addItem');
            let text = "text test";
            instance.addItem(text);
            expect(addNew).toHaveBeenCalled();
            expect(addNew).toHaveBeenCalledWith(text);            
            expect(component.state('_todos')).toEqual([{
                userId: 1,
                id: 0,
                title: text,
                completed: false
            }])
        });
        it('remove an item from the state array', () => {
            let instance = component.instance();
            let removeItem = jest.spyOn(instance, 'removeCurrentItem');
            let id = 0;
            instance.removeCurrentItem(id);
            expect(removeItem).toHaveBeenCalled();
            expect(removeItem).toHaveBeenCalledWith(id);
            expect(component.state('_todos')).toEqual([]);
        });
    });

    it('renders the <TodoItem /> component ', () => {
        const componentProps = {
            todoItem: {
                title: 'test title',
                id: 1,
                completed: false
            },
            toggleCompletedItem: jest.fn(),
            removeItem: jest.fn()
        };

        const wrapper = shallow(<TodoItem {...componentProps} />);
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('#test-id_title').text().trim()).toBe(componentProps.todoItem.title);
        wrapper.find('#test-id_toggle').simulate('click');
        expect(componentProps.toggleCompletedItem).toHaveBeenCalled();
        wrapper.find(FaRegTrashAlt).simulate('click');
        expect(componentProps.removeItem).toHaveBeenCalledWith(componentProps.todoItem.id);
    })

    describe('test the AddFoem component', () => {
        let addFormProps = {
            addNewItem: jest.fn(),
        }
        const wrapper = shallow(<AddForm {...addFormProps} />);
        let inputValue = 'someValue';

        it('renders the <AddForm /> Component', () => {
            expect(wrapper.length).toBe(1);
        });

        it('update the state when the input changed', () => {
            wrapper.find('input').simulate('change', { target: { value: inputValue } });
            expect(wrapper.state('text')).toBe(inputValue);
        });

        it('handle form submission', () => {
            wrapper.find('form').simulate('submit', { preventDefault() { } });
            expect(addFormProps.addNewItem).toHaveBeenCalled();
            expect(addFormProps.addNewItem).toHaveBeenCalledWith(inputValue);
            wrapper.instance().resetForm();
            expect(wrapper.state('text')).toBe('');
        })
    });
})