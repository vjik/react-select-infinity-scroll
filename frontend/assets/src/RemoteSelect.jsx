import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import Axios from 'axios'
import {debounce} from 'lodash'

export default function RemoteSelect({url, currentValue = ''}) {
    const [selected, setSelected] = useState(null)
    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [isAlreadyOpen, setIsAlreadyOpen] = useState(false)

    useEffect(() => {
        if (currentValue !== '') {
            const fetchData = async () => {
                setIsLoading(true)
                await Axios
                    .get(url, {
                        params: {value: currentValue},
                    })
                    .then((response) => {
                        setSelected(response.data)
                        setIsLoading(false)
                    })
            }
            fetchData()
        }
    }, [])

    useEffect(() => {
        if (!isAlreadyOpen) {
            return;
        }
        const abortController = new AbortController()
        const fetchData = async () => {
            setIsLoading(true)
            await Axios
                .get(url, {
                    params: {query, page},
                    signal: abortController.signal,
                })
                .then((response) => {
                    setOptions(
                        page > 1
                            ? options.concat(response.data.options)
                            : response.data.options
                    )
                    setHasNextPage(response.data.hasNextPage)
                    setIsLoading(false)
                })
                .catch((error) => {
                    if (!Axios.isCancel(error)) {
                        console.log(error);
                    }
                })
        }
        fetchData()
        return () => abortController.abort()
    }, [query, page, isAlreadyOpen])

    return <Select
        value={selected}
        onChange={value => setSelected(value)}
        options={options}
        isLoading={isLoading}
        isClearable={true}
        hasNextPage={hasNextPage}
        onMenuOpen={() => {
            setIsAlreadyOpen(true)
        }}
        onMenuScrollToBottom={() => {
            if (hasNextPage && !isLoading) {
                setPage(page + 1)
            }
        }}
        onInputChange={
            debounce(
                (value) => {
                    if (value !== query) {
                        setOptions([])
                        setQuery(value)
                        setPage(1)
                        setHasNextPage(true)
                    }
                },
                500
            )
        }
        filterOption={false}
    />
}
