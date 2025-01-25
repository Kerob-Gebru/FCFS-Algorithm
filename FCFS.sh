#!/bin/bash

# Function to calculate waiting time for each process
calculate_waiting_time() {
  local num_processes=$1
  local -n bt=$2 
  local -n wt=$3 

  wt[0]=0
  
  for ((i=1; i<num_processes; i++)); do
    wt[i]=${bt[$i-1]}
    wt[i]=$((${wt[i]} + ${wt[$i-1]}))
  done
}


calculate_turnaround_time() {
  local num_processes=$1
  local -n bt=$2
  local -n wt=$3
  local -n tat=$4

  for ((i=0; i<num_processes; i++)); do
    tat[i]=$((${wt[i]} + ${bt[i]}))
  done
}

# Function to display the results
display_results() {
  local num_processes=$1
  local -n bt=$2
  local -n wt=$3
  local -n tat=$4

  echo "Process  Burst Time  Waiting Time  Turnaround Time"
  for ((i=0; i<num_processes; i++)); do
    echo "P$i        ${bt[i]}          ${wt[i]}            ${tat[i]}"
  done
}

# Main function to take user input and run the FCFS scheduler
FCFS_main() {
  echo "Enter number of processes: "
  read num_processes

  declare -a burst_time
  declare -a waiting_time
  declare -a turnaround_time

  # Input burst times for each process
  for ((i=0; i<num_processes; i++)); do
    echo "Enter burst time for process P$i: "
    read burst_time[i]
  done

  calculate_waiting_time $num_processes burst_time waiting_time
  calculate_turnaround_time $num_processes burst_time waiting_time turnaround_time
  display_results $num_processes burst_time waiting_time turnaround_time
}

FCFS_main
