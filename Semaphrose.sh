#!/bin/bash

# Readers-Writers Problem Implementation in Shell Script

# Shared resources
read_count=0
read_lock=0
write_lock=0

# Initialize semaphores
init_semaphores() {
    mkfifo read_lock_pipe write_lock_pipe
    exec 3<>read_lock_pipe
    exec 4<>write_lock_pipe
    echo >read_lock_pipe
    echo >write_lock_pipe
}

# Destroy semaphores
cleanup_semaphores() {
    rm -f read_lock_pipe write_lock_pipe
}

# Reader function
reader() {
    local reader_id=$1
    echo "Reader $reader_id wants to read"

    # Acquire read_lock
    read <&3
    read_count=$((read_count + 1))
    if [ $read_count -eq 1 ]; then
        # First reader locks writer
        read <&4
    fi
    echo >read_lock_pipe

    echo "Reader $reader_id is reading..."
    sleep $((RANDOM % 2 + 1))  # Simulate reading

    # Release read_lock
    read <&3
    read_count=$((read_count - 1))
    if [ $read_count -eq 0 ]; then
        # Last reader unlocks writer
        echo >write_lock_pipe
    fi
    echo >read_lock_pipe

    echo "Reader $reader_id is done reading"
}

# Writer function
writer() {
    local writer_id=$1
    echo "Writer $writer_id wants to write"

    # Acquire write_lock
    read <&4

    echo "Writer $writer_id is writing..."
    sleep $((RANDOM % 2 + 1))  # Simulate writing

    # Release write_lock
    echo >write_lock_pipe

    echo "Writer $writer_id is done writing"
}

# Create reader and writer threads
simulate_readers_writers() {
    local num_readers=$1
    local num_writers=$2

    for ((i = 1; i <= num_readers; i++)); do
        reader $i &
    done

    for ((i = 1; i <= num_writers; i++)); do
        writer $i &
    done

    wait
    echo "Simulation complete"
}

# Main function
main() {
    init_semaphores

    num_readers=3
    num_writers=3

    simulate_readers_writers $num_readers $num_writers

    cleanup_semaphores
}

main
