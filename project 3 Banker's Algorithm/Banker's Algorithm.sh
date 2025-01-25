#!/bin/bash

# Banker's Algorithm Implementation in Shell Script

# Input data
resources=(10 5 7)  # Total resources
allocated=(
    "0 1 0"
    "2 0 0"
    "3 0 2"
    "2 1 1"
    "0 0 2"
)
maximum=(
    "7 5 3"
    "3 2 2"
    "9 0 2"
    "2 2 2"
    "4 3 3"
)

# Compute available resources
calculate_available() {
    total_used=(0 0 0)
    for alloc in "${allocated[@]}"; do
        i=0
        for val in $alloc; do
            total_used[$i]=$((total_used[$i] + val))
            i=$((i + 1))
        done
    done

    available=()
    for i in "${!resources[@]}"; do
        available[$i]=$((resources[$i] - total_used[$i]))
    done
}

# Check if a process can be safely executed
can_allocate() {
    local need=($1)
    for i in "${!need[@]}"; do
        if ((need[$i] > available[$i])); then
            return 1
        fi
    done
    return 0
}

# Calculate need matrix
calculate_need() {
    need=()
    for i in "${!maximum[@]}"; do
        max_row=(${maximum[$i]})
        alloc_row=(${allocated[$i]})
        need_row=()
        for j in "${!max_row[@]}"; do
            need_row[$j]=$((max_row[$j] - alloc_row[$j]))
        done
        need+=("${need_row[*]}")
    done
}

# Banker's Algorithm
bankers_algorithm() {
    calculate_available
    calculate_need

    finished=(0 0 0 0 0)  # Tracking finished processes
    safe_sequence=()

    while true; do
        progress=0
        for i in "${!finished[@]}"; do
            if ((finished[$i] == 0)); then
                need_row=(${need[$i]})
                if can_allocate "${need_row[*]}"; then
                    alloc_row=(${allocated[$i]})
                    for j in "${!alloc_row[@]}"; do
                        available[$j]=$((available[$j] + alloc_row[$j]))
                    done
                    finished[$i]=1
                    safe_sequence+=("P$i")
                    progress=1
                fi
            fi
        done

        if ((progress == 0)); then
            break
        fi
    done

    if [[ "${finished[*]}" =~ 0 ]]; then
        echo "System is in an unsafe state. Deadlock may occur."
    else
        echo "System is in a safe state. Safe sequence: ${safe_sequence[*]}"
    fi
}

# Run the algorithm
bankers_algorithm
