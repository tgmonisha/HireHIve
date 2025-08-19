{/*import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {/*{
        filterType: "Salary",
        array: ["1", "8", "10"]
    }, 
]

{/*
const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue, dispatch]);
    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    filterData.map((data, index) => (
                        <div key={`filter-${index}`}>
                            <h1 className='font-bold text-lg'>{data.filterType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id-${index}-${idx}`
                                    return (
                                        <div key={itemId} className='flex items-center space-x-2 my-2'>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label htmlFor={itemId}>{item}</Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard
*/}


import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Kolkata"]
    },
    {
        filterType: "Job Roles",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer","AI/ML Engineer", "Associative Engineer", "Software Developer", "Product Engineer"]
    }
];

const FilterCard = ({ onSalaryChange }) => {
    const [selectedValue, setSelectedValue] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    };

    const handleSalaryFilter = () => {
        if (onSalaryChange) {
            onSalaryChange(minSalary, maxSalary);
        }
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={`filter-${index}`}>
                        <h1 className='font-bold text-lg'>{data.filterType}</h1>
                        {data.array.map((item, idx) => {
                            const itemId = `id-${index}-${idx}`;
                            return (
                                <div key={itemId} className='flex items-center space-x-2 my-2'>
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </RadioGroup>

            {/* Salary Filter */}
            <div className='mt-4'>
                <h1 className='font-bold text-lg'>Salary Filter</h1>
                <div className='flex flex-col gap-2 mt-2'>
                    <div className='flex items-center justify-between'>
                        <Label htmlFor="min-salary">Min Salary</Label>
                        <input
                            type="number"
                            id="min-salary"
                            value={minSalary}
                            onChange={(e) => setMinSalary(e.target.value)}
                            placeholder="Min"
                            className="border p-2 rounded-md w-20"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <Label htmlFor="max-salary">Max Salary</Label>
                        <input
                            type="number"
                            id="max-salary"
                            value={maxSalary}
                            onChange={(e) => setMaxSalary(e.target.value)}
                            placeholder="Max"
                            className="border p-2 rounded-md w-20"
                        />
                    </div>
                    <button
                        onClick={handleSalaryFilter}
                        className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        Apply Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterCard;
